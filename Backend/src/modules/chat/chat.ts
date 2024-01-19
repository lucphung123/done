export namespace ChatNS {
    export enum MessageType {
      NewMessage = 'new-message',
      SendMessage = 'send-message',
      DeleteMessage = 'delete-message',
      JoinBox = 'join-box',
      GetMe = 'get-me',
      LoadBox = 'load-box',
      LeaveBox = 'leave-box',
      ScrollMessage = 'scroll-message'
    }
  
    export interface paramsMessage {
      page: number,
      limit: number
    }
  }