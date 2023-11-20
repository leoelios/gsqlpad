import Session from "./session";

export default interface Instance {
  identifier: string;
  instance: string;
  user: string;
  password: string;
  session: Session;
}
