import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { MessageService } from '../services/message.service';
import { UserInfoService } from '../services/user-info.service';
import { ChatroomService } from '../services/chatroom.service';
import { User } from '../models/user.model';
import { Chat } from '../models/chat.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit {
  @Input() userInfo: User;
  selectedChatRoomID = 'UgQEVNxekZrld8UJqtkZ';
  chatroomSubscription: Subscription;
  userListSubscription: Subscription;
  selectedName: string;
  text: string;
  message = '';
  messages: string[] = [];
  email = '';
  users: string[] = [];
  secretCode = 'secret';
  friendListId = [];
  conversationsListId = [
    '05kbCceCnYxcfOxewCJK',
    'UgQEVNxekZrld8UJqtkZ',
    'e0cGp5IpWGb9AuC3iuM2',
    'ji9ldKigbHxBadcZyb1E'
  ];
  selectedConversation = {
    name: ''
  };
  conversations = [];

  //  Stores all available chatrooms to the user
  chatroomList = [];

  friendList = [
    {
      id: 'SyFrC5N7QlUNyia8aJWqWySdDFx1',
      name: 'Random'
    },
    {
      id: 'l9A3All48lZkGjNhnOkTfF0JREg1',
      name: 'General'
    },
    {
      id: 'yKoayuA5IIb32BUkKvYvWOk6xx13',
      name: 'ChittyC'
    }
  ];

  events = [
    {
      from: '1',
      type: 'text',
      text: 'mesages'
    },
    {
      from: '2',
      type: 'text',
      text: 'messages'
    }
  ];

  userListEvents = [
    {
      uid: '1',
      type: 'text',
      displayName: 'mesages',
      email: 'example@email.com'
    },
    {
      uid: '2',
      type: 'text',
      displayName: 'messages',
      email: 'example@email.com'
    }
  ];
  constructor(
    private chatService: ChatService,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private messageService: MessageService,
    private userInfoService: UserInfoService,
    private chatRoomService: ChatroomService
  ) {}

  ngOnInit() {
<<<<<<< HEAD
    this.getChatroomList()
      .then(() => {
        if (this.chatroomList.length) {
          this.openConversation(0);
        }
      });
=======
    // this.chatService
    //   .getMessages()
    //   .subscribe((message: string) => {
    //     this.messages.push(message);
    //     this.events.push({
    //       from: '1',
    //       type: 'text',
    //       text: message
    //     });
    //   });

    // this.chatRoomService
    // .getUpdates(this.selectedChatRoomID)
    // .subscribe((message: any) => {
    //   console.log(message);
    //   message.forEach((element: Chat) => {
    //     this.events.push({
    //     from: '1',
    //     type: 'text',
    //     text: element.content
    //   });
    //   });
    // });
    this.updateChatHistory();
    this.updateUserList();
    // console.log(this.messages);

>>>>>>> Added interface for adding person by email and listed global users
    console.log(this.userInfo);
  }

  updateChatHistory() {
    this.events = [];
    this.chatroomSubscription = this.chatRoomService
      .getUpdates(this.selectedChatRoomID)
      .subscribe((message: any) => {
        console.log(message);
        message.forEach((element: Chat) => {
          this.events.push({
            from: element.user,
            type: 'text',
            text: element.content
          });
          console.log(this.events);
        });
      });
  }

  getFriendList() {
    this.friendListId = this.userInfo ? this.userInfo.friendList : [];
    console.log(this.friendList);
    this.friendListId.forEach(friendID => {
      this.userInfoService
        .getCurrentUserInfo(friendID)
        .subscribe((res: any) => {
          console.log(res.payload.data());
          this.friendList.push({
            id: res.payload.data().uid,
            name: res.payload.data().displayName.substring(0, 7)
          });
          console.log(this.friendList);
        });
    });
  }

  getConversations() {
    this.conversationsListId = this.userInfo ? this.userInfo.chatrooms : [];
  }

  selectConversation(id: string, index: number) {
    const result = this.conversations.filter(
      conversation => conversation.id === id
    );
    this.openConversation(index);
  }

  openConversation(index: number) {
    if (this.chatroomSubscription) {
      this.chatroomSubscription.unsubscribe();
    }
    this.selectedConversation.name = this.chatroomList[index].name;
    this.selectedChatRoomID = this.chatroomList[index].id;
    this.updateChatHistory();
  }

  deleteConversation(id: string) {
    const deleteIndex = this.conversations.findIndex(item => item.id === id);
    this.conversations.splice(deleteIndex, 1);
  }
  sendMsgToFirebase(message: string) {
    const date = new Date();
    this.messageService.sendMessage(
      this.userInfo.uid,
      date,
      this.selectedChatRoomID,
      message
    );
  }

  sendMessage(message: string) {
    if (this.message !== '') {
      this.sendMsgToFirebase(message);
      this.message = '';
      const objDiv = document.getElementById('content');
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  //  Retrieves the user's chatrooms and stores them in this.chatroomList
  getChatroomList(): Promise<void> {
      return new Promise((resolve, reject) => {
        const availableChatrooms = this.chatroomList;
        this.userInfoService.getCurrentUserInfo(this.userInfo.uid)
          .subscribe({
            next(data: any) {
              const chatroomRefs = data.payload.data().chatroomRefs;
              if (chatroomRefs.length > 0) {
                chatroomRefs.forEach((item, index, arr) => {
                    item.get().then((chatroom) => {
                      const chatroomData = chatroom.data();
                      availableChatrooms.push({
                        id: item.id,
                        name: chatroomData.roomName
                      });

                      if (index === arr.length - 1) {
                        resolve();
                      }
                    });
                  });
                } else {
                  reject(new Error());
                }
            }
          })
    });
  }
  /**
   * getUserByEmail(email: string) {
    if (this.email !== '') {
      this.userInfoService.getUserByEmail(email);
      this.email = '';
    }
  }
  */
  addUserByEmail(email: string) {
    if (this.email !== '') {
      this.userInfoService.getUserByEmail(email).then(
        () => console.log('successfully added'),
        () => console.log('email does not exist')
      );
      this.email = '';
    }
  }

  updateUserList() {
    this.userListEvents = [];
    this.userListSubscription = this.userInfoService
      .getUserList()
      .subscribe((message: any) => {
        console.log(message);
        message.forEach((element: User) => {
          this.userListEvents.push({
            uid: element.uid,
            type: 'text',
            displayName: element.displayName,
            email: element.email
          });
          console.log(this.userListEvents);
        });
      });
  }
}

