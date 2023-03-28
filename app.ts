import { createReadStream } from "fs";
import { mapSync, split } from "event-stream";
import mongoose from "mongoose";
import usersModel from "./users.model";

// Your db connection string here
const dbUri = "mongodb+srv://kiroloskr7:k123456@fbdb.acjsnbr.mongodb.net/fbdb";
let counter = 0;

const storeFile = async (path: string) => {
  const s = createReadStream("./txt/" + path)
    .pipe(split())
    .pipe(
      mapSync(async (line: string) => {
        s.pause();

        if (line.startsWith("$HEX["))
          line = Buffer.from(
            line.replace("$HEX[", "").replace("]", ""),
            "hex"
          ).toString();

        let fields = line.split(",");
        fields = fields.map((x) => x.replaceAll('"', ""));

        const [
          uid,
          ,
          ,
          tel,
          ,
          ,
          first_name,
          last_name,
          gender,
          ,
          ,
          username,
          ,
          ,
          works_at,
          ,
          from,
          lives_in,
          studied_at,
          ,
          ,
          ,
          ,
          ,
          ,
          relationship_status,
        ] = fields;

        const user = {
          _id: tel,
          uid,
          username,
          first_name,
          last_name,
          gender,
          works_at,
          studied_at,
          lives_in,
          from,
          relationship_status,
        };

        if (!uid || !tel) {
          s.resume();
          return;
        }

        await usersModel
          .create(user)
          .then(() =>
            console.log(
              `[✔] [${counter++}] - Adding user with id: ${user._id}.`
            )
          )
          .catch((err) => {
            if (err.code == 11000) console.log(`[✖] - User Already Exists.`);
            else console.log(err);
          })
          .finally(() => s.resume());
      })
    )
    .on("", () => {})
    .on("error", function (err) {
      console.log("Error while reading file.", err);
    })
    .on("end", function () {
      console.log("Read entire file.");
    });
};

const init = async () => {
  // Array of file paths
  const filePaths = ["EG0903"];

  mongoose.connect(dbUri).then(() => {
    console.log("DB Connected");
    filePaths.forEach((path) => storeFile(path));
  });
};

init();
