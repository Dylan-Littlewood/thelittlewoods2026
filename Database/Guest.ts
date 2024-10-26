export enum EventResponse {
  Pending = 0,
  Confirmed = 1,
  Declined = 2
}

export default interface Guest {
  id: string,
  firstName: string,
  lastName: string,
  events: {id:string, eventName: string, guestResponse: EventResponse}[]
}