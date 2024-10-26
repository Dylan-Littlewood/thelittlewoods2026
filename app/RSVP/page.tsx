"use client"
import { GuestRef } from "@/Database/Firebase"
import { EventResponse } from "@/Database/Guest";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore"



export default function RSVP() {
  const [data, loading, error] = useCollectionData(GuestRef);

  data && data.forEach((guest) => {
    console.log(guest);
  })

  return (
    <div>
      RSVP
      <div>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {data && (
          <span>
            {data.map((guest) => (
              <React.Fragment key={guest.id}>
                <p>Guest Name: {guest.firstName} {guest.lastName}</p>
                <p>Events:</p>
                <span>
                  {guest.events.map((event => (
                    <React.Fragment key={guest.id + "[" + event.id + "]"}>
                      <p>Event: {event.eventName}</p>
                      <p>Response: {EventResponse[event.response]}</p>
                    </React.Fragment>
                  )))}
                </span>
              </React.Fragment>
            ))}
          </span>
        )}
      </div>
      <button onClick={()=> FetchGuestList()}>Test</button>
    </div>
  )
}



const FetchGuestList = async () => {

}
