import { logger } from "firebase-functions/v1";
import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { Cookie } from "./Cookie";
import * as cheerio from 'cheerio';
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue } from "firebase-admin/firestore";
import { Element } from "domhandler";
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

export const UpdateGuestList_Scheduled = onSchedule("0 0 * * 1", async (event) => {
  UpdateGuestList_Firebase();
})

export const UpdateGuestList = onRequest(async (request, response) => {
  const res = await UpdateGuestList_Firebase();
  response.status(res.status).send(res.message);
});

const guestConverter: FirestoreDataConverter<Guest> = {
  toFirestore(guest: WithFieldValue<Guest>): DocumentData {
    return { firstName: guest.firstName, lastName: guest.lastName, events: guest.events };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot
  ): Guest {
    return {
      id: snapshot.id,
      firstName: snapshot.data().firstName,
      lastName: snapshot.data().lastName,
      events: snapshot.data().events
    };
  },
};

enum EventResponse {
  Pending = 0,
  Confirmed = 1,
  Declined = 2,
  Undefined = -1
}

interface Guest {
  id: string,
  firstName: string,
  lastName: string,
  events: {id:string, eventName: string, guestResponse: EventResponse}[]
}
interface Response {
  status: number,
  message: string
}

async function UpdateGuestList_Firebase(): Promise<Response> {
  const myHeaders = new Headers();
  myHeaders.append("Cookie", Cookie);
  const requestOptions = {
    method: "GET",
    headers: myHeaders
  };
  let response = { status: 500, message: "Could not get data from the server." };
  await fetch("https://www.hitched.co.uk/tools/Guests", requestOptions)
    .then((res) => res.text())
    .then((result) => {
      const $ = cheerio.load(result);
      const events = GetEventNames($);

      $('.app-contact-row').each((i, guestElement) => {
        const guestID = AsString($(guestElement).attr('data-contact-id'));
        const guestName = AsStrings($(guestElement).attr('data-name')?.split(' '));
        const guestEvents = GetGuestEvents($, guestElement, events);
        UpdateGuest_Firebase({
          'id': guestID,
          'firstName': guestName[0],
          'lastName': guestName[1],
          'events': guestEvents
        });
      });
      response = { status: 200, message: "Success" };
    })
    .catch((error) => {
      logger.error(error);
      response = { status: 502, message: error };
    });
  return response;
}

async function UpdateGuest_Firebase(guest:Guest) {
  await db.collection("Guests").withConverter(guestConverter).doc(guest.id).set(guest);
}

function GetGuestEvents($: cheerio.CheerioAPI, guestElement: Element, events: { [key: string]: string; }) {
  const guestEvents: { id: string, eventName: string, guestResponse: EventResponse }[] = [];
  $(guestElement).find('.select-attendance').each((j, eventElement) => {
    const eventID = AsString($(eventElement).attr("data-event"));
    const eventName = events[eventID];
    const eventResponse = StringToEventResponse($(eventElement).find('.input-select-label').text());
    guestEvents.push({ 'id': eventID, 'eventName': eventName, 'guestResponse': eventResponse });
  });
  return guestEvents;
}

function GetEventNames($: cheerio.CheerioAPI) {
  const events: { [key: string]: string; } = {};
  $('.app-guests-summary-event').each((i, el) => {
    const eventID = $(el).attr('data-event');
    const eventName = $(el).find('.guestStats__title').text();
    if (eventID !== undefined) {
      events[eventID] = eventName;
    }
  });
  return events;
}

function StringToEventResponse(eventResponse: string) {
  switch (eventResponse) {
    case "Pending":
      return EventResponse.Pending;
    case "Confirmed":
      return EventResponse.Confirmed;
    case "Declined":
      return EventResponse.Declined;
    default:
      return EventResponse.Undefined;
  }
}

function AsString(string: string | undefined): string {
  if (string !== undefined) {
    return string;
  }
  return '';
}

function AsStrings(string: string[] | undefined): string[] {
  if (string !== undefined) {
    return string;
  }
  return [];
}