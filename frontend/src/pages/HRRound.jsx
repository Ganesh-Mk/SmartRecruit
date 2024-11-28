import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function HRRound() {
  const { id } = useParams();
  const roomID = id;
  const meetingContainerRef = useRef(null); // Create a ref to attach to the div

  useEffect(() => {
    if (meetingContainerRef.current) {
      // generate Kit Token
      const appID = 2138661963;
      const serverSecret = "f12b35a6709a5fe7b013ef44c34d1a53";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        Date.now().toString(),
        "SmartRecruit"
      );

      // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      // start the call
      zp.joinRoom({
        container: meetingContainerRef.current, // Use the ref to attach to the container
        sharedLinks: [
          {
            name: "Copy link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
      });
    }
  }, [roomID]); // Re-run this effect when roomID changes

  return <div ref={meetingContainerRef}></div>; // Attach the ref to this div
}
