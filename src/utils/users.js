const users = [];

const addUser = ({ id, username, room }) => {
  // Clean the data.
  if (!username || !room) return { error: "Username and Room are required" };
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Check for existing user.
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return { error: "Username already in use." };
  }

  // Store user.
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  if (!user) return { error: "User does not exist." };
  return user;
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  const usersInRoom = users.filter((user) => user.room === room);
  if (usersInRoom.length === 0) return { error: "Room does not exist." };
  return usersInRoom;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
