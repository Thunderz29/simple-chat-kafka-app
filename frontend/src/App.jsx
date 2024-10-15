/* eslint-disable no-unused-vars */
import { Client } from '@stomp/stompjs';
import axios from "axios";
import { Send, User } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import SockJS from "sockjs-client";
import { v4 } from "uuid";

const App = () => {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/chat`);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }, []);

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new SockJS(import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:8080/websocket-endpoint");
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log("WebSocket connected!");
          client.subscribe("/topic/messages", (message) => {
            const newMessage = JSON.parse(message.body);
            setMessages(prevMessages => {
              if (!prevMessages.some(msg => msg.id === newMessage.id)) {
                return [...prevMessages, newMessage];
              }
              return prevMessages;
            });
          });
        },
        onStompError: (frame) => {
          console.error("Broker reported error: ", frame.headers.message);
        },
      });
      client.activate();
      return client;
    };

    setStompClient(connectWebSocket());
    return () => stompClient?.deactivate();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !sender || !receiver) return;

    const newMessage = { sender, receiver, message };
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/v1/chat`, newMessage);
      setMessage("");
      setMessages(prevMessages => [...prevMessages, newMessage]);
      // stompClient?.publish({ destination: "/app/chat", body: JSON.stringify(newMessage) });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const selectUser = (selectedSender, selectedReceiver) => {
    setSender(selectedSender);
    setReceiver(selectedReceiver);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Select User</h2>
          <button
            className="w-full py-2 px-4 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => selectUser("user1", "user2")}
          >
            User 1
          </button>
          <button
            className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={() => selectUser("user2", "user1")}
          >
            User 2
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow">
          <div className="p-4 flex items-center">
            <User className="h-8 w-8 text-gray-500 mr-2" />
            <h2 className="text-xl font-bold">{sender || "Select a user"}</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages?.map((msg) => (
            <div
            key={msg.id || v4()}
              className={`mb-4 flex ${
                msg.sender === sender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${
                  msg.sender === sender
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="bg-white border-t p-4">
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;