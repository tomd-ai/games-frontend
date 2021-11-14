import {useState, useRef, useContext, useCallback, useEffect} from 'react';
import {useSelector} from "react-redux";
import {wordGridSolverSocketContext}  from '../context/socket2'
import Webcam from 'react-webcam';

const videoConstraints = {
    width: 250,
    height: 250,
    facingMode: "user"
  };


function WordGridSolver(props:any) {

    const wordGridSolverSocket = useContext(wordGridSolverSocketContext);
    const gridData = useSelector((s:any) => s.wordGridSolverData);
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    let keepLooking = useRef(true)

    // useEffect(()=>{
    //     console.log("using effect")
    //     if (webcamRef.current){
    //         let interval = setInterval(
    //             function(){ 
    //                 if (webcamRef.current){
    //                     wordGridSolverSocket.emit("solve-image", {
    //                         "imageData" : webcamRef.current.getScreenshot()
    //                     })
    //                 }
    //             },1000
    //         );
    //     }

    // }, [])

    const handleSearchBoundaries = useCallback((data)=>{
        console.log("New search boundaries!")
        if (webcamRef.current){
            //const imageSrc = webcamRef.current.getScreenshot();
            // console.log(imageSrc)
            setImgSrc(data["imgWithBoundaries"]);
            // console.log(data["imgWithBoundaries"])
            keepLooking.current = false
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    useEffect( ()=>{
        
        wordGridSolverSocket.on('connect',
            () => {
                console.log("connected wordGrid")
            }
        );

        wordGridSolverSocket.emit("join", {})

        wordGridSolverSocket.on("solved-image", handleSearchBoundaries)


        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            wordGridSolverSocket.off("solved-image", handleSearchBoundaries)
          };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wordGridSolverSocket, handleSearchBoundaries])

    const capture = useCallback(
        () => {
            if (webcamRef.current) {
                // const imageSrc = webcamRef.current.getScreenshot();
                // // console.log(imageSrc)
                // setImgSrc(imageSrc);

                wordGridSolverSocket.emit("solve-image", {
                    "imageData" : webcamRef.current.getScreenshot()//imgSrc
                })
            }
        },
    // eslint-disable-next-line react-hooks/exhaustive-deps
        [webcamRef]
    );

    // const renderImg = () => {
    //     console.log("render img")
    //     // console.log(imgSrc)
    //     if (imgSrc){
    //         console.log("passed")
    //         console.log(imgSrc)
    //         return <img src={imgSrc} />
    //     }
    // }

    // useEffect(()=>{
    //     renderImg()
    // }, [imgSrc])

    return (
    <div className="project">
        <p>Use your camera to populate the grid:</p>

        <p  style={{ "fontSize": "12px"}}>
            In progress - text detection is a challenging problem - pressing capture photo
            will return the image with the bounding boxes of where text might be located.
        </p>

        <table>
        <tr>
        <td>{
            <Webcam
                audio={false}
                height={250}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={250}
                videoConstraints={videoConstraints}
            />
        }</td>
        <td>
            {
                imgSrc && <img alt="" src={imgSrc} />
            }
        </td>
        </tr>
        <td>
            <button onClick={capture}>Capture photo</button>
        </td>
        <td>

        </td>
        </table>
        <div className="webcamPreview">
        
        </div>
        <div className="webcamScreenshot">

        </div>

        <table className="wordGridTable" style={{tableLayout: "fixed"}}>
            <thead>
            </thead>
            <tbody>
                <tr><td>{gridData.A1}</td><td>{gridData.A2}</td><td>{gridData.A3}</td><td>{gridData.A4}</td></tr>
                <tr><td>{gridData.B1}</td><td>{gridData.B2}</td><td>{gridData.B3}</td><td>{gridData.B4}</td></tr>
                <tr><td>{gridData.C1}</td><td>{gridData.C2}</td><td>{gridData.C3}</td><td>{gridData.C4}</td></tr>
                <tr><td>{gridData.D1}</td><td>{gridData.D2}</td><td>{gridData.D3}</td><td>{gridData.D4}</td></tr>
            </tbody>
        </table>

        <p>Or enter each letter, reading left to right</p>
        <input></input><button>Solve</button>
    </div>
  );
}

export default WordGridSolver;