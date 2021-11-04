const PORT = process.env.PORT || 5000;
const webSocket = new WebSocket(`ws://auction-nhom5.herokuapp.com`);
export default webSocket;