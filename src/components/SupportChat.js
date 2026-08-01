import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";

const API_BASE_URL = "https://chocopo-backend.onrender.com/api";

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef(null);

  const getCustomerData = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem("customer_data") || "{}");
    } catch {
      return {};
    }
  }, []);

  const loadMessages = useCallback(async () => {
    const customerData = getCustomerData();
    const email = customerData.email || "";

    if (!email) {
      setMessages([
        {
          id: "welcome",
          sender: "admin",
          text: "Hi! Please log in first so our support team can reply to you.",
          time: "Now"
        }
      ]);
      return;
    }

    try {
      const response = await axios.get(
        API_BASE_URL + "/support/messages?email=" + encodeURIComponent(email)
      );

      const formattedMessages = response.data.map((item) => ({
        id: item.id,
        sender: item.sender,
        text: item.message,
        time: new Date(item.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }));

      setMessages(formattedMessages);
    } catch {
      setMessages([
        {
          id: "welcome",
          sender: "admin",
          text: "Hi! Welcome to CHOCOPO support. How can we help you?",
          time: "Now"
        }
      ]);
    }
  }, [getCustomerData]);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen, loadMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || sending) {
      return;
    }

    const customerData = getCustomerData();
    const customerEmail = customerData.email || "";
    const customerName = customerData.full_name || customerData.name || "";

    if (!customerEmail) {
      alert("Please log in before sending a support message.");
      return;
    }

    setSending(true);

    try {
      await axios.post(API_BASE_URL + "/support/messages", {
        message: cleanMessage,
        customer_name: customerName,
        customer_email: customerEmail
      });

      setMessage("");
      await loadMessages();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Could not send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="support-chat-wrapper">
      {isOpen && (
        <div className="support-chat-window">
          <div className="support-chat-header">
            <div>
              <span className="support-online-dot"></span>

              <div>
                <h3>CHOCOPO Support</h3>
                <p>Questions, orders and complaints</p>
              </div>
            </div>

            <button
              type="button"
              className="support-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close support chat"
            >
              ×
            </button>
          </div>

          <div className="support-chat-messages">
            {messages.length === 0 ? (
              <div className="support-empty-chat">
                Start a conversation with CHOCOPO support.
              </div>
            ) : (
              messages.map((chatMessage) => (
                <div
                  className={
                    "support-message-row " + chatMessage.sender
                  }
                  key={chatMessage.id}
                >
                  <div className="support-message-bubble">
                    <p>{chatMessage.text}</p>
                    <span>{chatMessage.time}</span>
                  </div>
                </div>
              ))
            )}

            <div ref={messageEndRef}></div>
          </div>

          <form className="support-chat-form" onSubmit={sendMessage}>
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type your message..."
              disabled={sending}
            />

            <button type="submit" disabled={sending}>
              {sending ? "..." : "➤"}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="support-chat-toggle"
        onClick={() => setIsOpen((currentState) => !currentState)}
        aria-label="Open CHOCOPO support chat"
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
}
