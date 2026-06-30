const messageFilter = (message, me) => {
  // create empty array
  // loop the message and add the newest user only

  const filtered = [];
  const ids = [];
  message.forEach((msg) => {
    const other =
      msg.sender._id.toString() === me._id.toString()
        ? { ...msg.recever, type: "sent" }
        : { ...msg.sender, type: "recieved" };

    if (!ids.includes(other)) {
      filtered.push({
        other,
        message: msg.message,
        date: msg.createdAt,
        unread: msg.status === "unread" ? 1 : 0,
      });
      ids.push(other);
    } else {
      const index = ids.indexOf(other);
      filtered[index].unread += msg.status === "unread" ? 1 : 0;
    }
  });

  return filtered;
};

module.exports = {
  messageFilter,
};
