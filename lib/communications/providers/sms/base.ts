import { SMSMessage, SMSResult, SMSStatus } from "../../types";

export interface SMSProvider {
  readonly name: string;
  send(message: SMSMessage): Promise<SMSResult>;
  getStatus?(messageId: string): Promise<SMSStatus>;
}
