import "./index.css";
import { Composition, Folder } from "remotion";
import { UXPMain } from "./UXPMain";
import { W, H, FPS, f } from "./timing";

// 43 seconds total at 60 FPS
const TOTAL = f(43.0);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="UXP-Demo">
        <Composition
          id="UXP-Main"
          component={UXPMain}
          durationInFrames={TOTAL}
          fps={FPS}
          width={W}
          height={H}
        />
      </Folder>
    </>
  );
};
