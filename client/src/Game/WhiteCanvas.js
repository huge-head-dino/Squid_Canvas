import "./WhiteCanvas.css";
import GameCanvas from './JUNHO/GameCanvas';
import { CanvasProvider } from "./JUNHO/CanvasContext";

function WhiteCanvas() {

    return(
        <div className="WhiteCanvas">
            <CanvasProvider>
                <GameCanvas />
            </CanvasProvider>
        </div>
    )
}
export default WhiteCanvas;