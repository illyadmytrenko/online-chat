export default interface Message {
  text: string;
  senderId: string | null;
  receiverId: string | null;
}
