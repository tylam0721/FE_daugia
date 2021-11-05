const PORT = process.env.PORT || 4000;
//const webSocket = new WebSocket(`ws://auction-nhom5.herokuapp.com`);
const webSocket = new WebSocket(`ws://localhost:4000`);
export default webSocket;