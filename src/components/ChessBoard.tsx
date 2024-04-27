import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ board, socket, chess, setBoard }: {
    board: ({ 
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][],
    socket: WebSocket | null;
    chess: Chess;
    setBoard: any;
})=> {
    const [from, setFrom] = useState<Square | null>(null);
    const [to, setTo] = useState<Square | null>(null);

    return <div>
        {board.map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {
                    const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                    return <div onClick={() => {
                        if (!from) {
                            setFrom(squareRepresentation)
                        } else {
                            setTo(squareRepresentation)
                            socket?.send(JSON.stringify({
                                type: MOVE,
                                payload: {
                                    move:{
                                        from: from,
                                        to: squareRepresentation
                                    }
                                    
                                }
                            }));
                            chess.move({
                                from: from,
                                to: squareRepresentation
                            })
                            setBoard(chess.board())
                            setFrom(null);
                            setTo(null);
                        }
                    }} key={j} className={`w-16 h-16 ${(i+j) % 2 == 0 ? 'bg-green-500' 
                    : 'bg-white'}`}>
                        <div className="flex justify-center h-full">
                            <div className="flex flex-col justify-center">
                                {square ? <img className="p-2" src={`/${square?.color === "b" ? 
                                    square?.type : `${square?.type?.toUpperCase()}_W`}.png`} /> 
                                : null}
                            </div>
                            
                        </div>
                        
                    </div>
                })}
            </div>
        })}
    </div>
}