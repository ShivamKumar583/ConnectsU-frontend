import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CONVERSATION_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/conversation`;
const MESSAGE_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/message`;

const initialState = {
  status: "",
  error: "",
  conversations: [],
  activeConversation: {},
  messages: [],
  notifications: [],
  files: [],
  unseenMessageCounts: {},
};

//functions
export const getConversations = createAsyncThunk(
  "conervsation/all",
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(CONVERSATION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const open_create_conversation = createAsyncThunk(
  "conervsation/open_create",
  async (values, { rejectWithValue }) => {
    const { token, receiver_id, isGroup } = values;
    try {
      const { data } = await axios.post(
        CONVERSATION_ENDPOINT,
        { receiver_id, isGroup },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const getConversationMessages = createAsyncThunk(
  "conervsation/messages",
  async (values, { rejectWithValue }) => {
    const { token, convo_id } = values;
    try {
      const { data } = await axios.get(`${MESSAGE_ENDPOINT}/${convo_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const sendMessage = createAsyncThunk(
  "message/send",
  async (values, { rejectWithValue }) => {
    const { token, message, convo_id, files } = values;
    try {
      const { data } = await axios.post(
        MESSAGE_ENDPOINT,
        {
          message,
          convo_id,
          files,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);
export const createGroupConversation = createAsyncThunk(
  "conervsation/create_group",
  async (values, { rejectWithValue }) => {
    const { token, name, users } = values;
    try {
      const { data } = await axios.post(
        `${CONVERSATION_ENDPOINT}/group`,
        { name, users },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

// reactions feature
export const addMessageReaction = createAsyncThunk(
  "message/addMsgReaction",
  async (values, { rejectWithValue }) => {
    const { token, message_id, reaction } = values;
    try {
      const { data } = await axios.post(
        `${MESSAGE_ENDPOINT}/${message_id}/reaction`,
        {
          reaction,
          message_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Someting went wrong"
      );
    }
  }
);
// reactions feature

export const removeMessageReaction = createAsyncThunk(
  "message/removeMsgReaction",
  async (values, { rejectWithValue }) => {
    const { token, message_id } = values;
    try {
      const { data } = await axios.delete(
        `${MESSAGE_ENDPOINT}/${message_id}/reaction`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Someting went wrong"
      );
    }
  }
);

// seen feature markMessagesAsSeen
export const markMessagesAsSeen = createAsyncThunk(
  "conversation/markSeen",
  async (values, { rejectWithValue }) => {
    const { token, conversationId } = values;
    try {
      
      const { data } = await axios.put(
        `${CONVERSATION_ENDPOINT}/${conversationId}/seen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { conversationId, data };
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

// translate messages
export const translateMessage = createAsyncThunk(
  "message/translateMessage",
  async (values, { rejectWithValue }) => {
    const { token, message_id } = values;
    try {
      const { data } = await axios.post(
        `${MESSAGE_ENDPOINT}/${message_id}/translate`,
        {
          message_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return data.translatedMessage[0];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Someting went wrong"
      );
    }
  }
);

//  schedule messages
export const scheduleMessage = createAsyncThunk(
  "message/scheduleMessage",
  async (values, { rejectWithValue }) => {
    const { token, sender ,message,conversation,scheduledAt } = values;
    try {
      const { data } = await axios.post(
        `${MESSAGE_ENDPOINT}/schedule`,
        {
          sender ,message,conversation,scheduledAt
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message || "Someting went wrong"
      );
    }
  }
);


export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    updateMessagesAndConversations: (state, action) => {
      //update messages
      let convo = state.activeConversation;
      if (convo._id === action.payload.conversation._id) {
        state.messages = [...state.messages, action.payload];
      }
      //update conversations
      let conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload,
      };
      let newConvos = [...state.conversations].filter(
        (c) => c._id !== conversation._id
      );
      newConvos.unshift(conversation);
      state.conversations = newConvos;
    },
    addFiles: (state, action) => {
      state.files = [...state.files, action.payload];
    },
    clearFiles: (state, action) => {
      state.files = [];
    },
    removeFileFromFiles: (state, action) => {
      let index = action.payload;
      let files = [...state.files];
      let fileToRemove = [files[index]];
      state.files = files.filter((file) => !fileToRemove.includes(file));
    },

    // reactions feature
    addReaction: (state, action) => {
      const { messageId, userId, reaction } = action.payload;
      const message = state.messages.find((msg) => msg._id === messageId);
    
      if (message) {
        // Ensure reactions array exists
        if (!message.reactions) {
          message.reactions = [];
        }
    
        // Find the index of the existing reaction
        const existingReactionIndex = message.reactions.findIndex(
          (r) => r.user === userId
        );
    
        if (existingReactionIndex !== -1) {
          // Remove the existing reaction
          message.reactions.splice(existingReactionIndex, 1);
        }
    
        // Add the new or updated reaction at the front (index 0)
        message.reactions.unshift({ user: userId, reaction });
      }
    },
    
    // reactions feature
    removeReaction: (state, action) => {
      const { messageId, userId } = action.payload;
      const message = state.messages.find((msg) => msg._id === messageId);
      if (message) {
        message.reactions = message.reactions.filter((r) => r.user !== userId);
      }
      
    },

    // seen feature
    updateUnseenMessageCount: (state, action) => {
      const { conversationId, increment } = action.payload;
    
      // Increment unseen message count for the conversation
      if (increment) {
        // Ensure we only increment if increment is greater than the current count
        const currentCount = state.unseenMessageCounts[conversationId] || 0;
        state.unseenMessageCounts[conversationId] = currentCount + increment;
    
      }
    },
    
    // seen feature
    markSeenMessages: (state, action) => {
      const { conversationId } = action.payload;
      state.unseenMessageCounts[conversationId] = 0;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getConversations.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(open_create_conversation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(open_create_conversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeConversation = action.payload;
        state.files = [];
      })
      .addCase(open_create_conversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getConversationMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = [...state.messages, action.payload];
        let conversation = {
          ...action.payload.conversation,
          latestMessage: action.payload,
        };
        let newConvos = [...state.conversations].filter(
          (c) => c._id !== conversation._id
        );
        newConvos.unshift(conversation);
        state.conversations = newConvos;
        state.files = [];
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(markMessagesAsSeen.fulfilled, (state, action) => {
        const { conversationId } = action.payload;
        delete state.unseenMessageCounts[conversationId]; // Clear unseen messages count
      });
  },
});
export const {
  setActiveConversation,
  updateMessagesAndConversations,
  addFiles,
  clearFiles,
  removeFileFromFiles,
  updateUnseenMessageCount,
  markSeenMessages,
  addReaction,
  removeReaction
} = chatSlice.actions;

export default chatSlice.reducer;
