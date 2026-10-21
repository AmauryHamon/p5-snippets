# Collaborative P5.js canvas, using node.js, express server and socket.io 

- in terminal, run `npm install`
- in terminal, run `node server.js`
- test locally: open in browser multiple tabs to `localhost:3000` or whichever port the host uses (see three hosting examples below)
- play together on the same wifi: your local IP and port (example: http://192.168.1.42:3000) Some school / public networks block this → use a phone hotspot
- run online: create GitHub repo and deploy using [render](https://render.com/), [railway](https://railway.com/), [fly.io](https://fly.io/) or equivalent

- run online temporarily:
    - terminal install cloudflared with homebrew `brew install cloudflared``
    - make sure to run server.js. in VSC terminal, run `npm run start` or `node server.js`
    - in separate terminal tab, run ` cloudflared tunnel --url http://localhost:<PORT>` (replace <PORT> with the port defined in server.js)
    - access the temp URL and share it to friends!