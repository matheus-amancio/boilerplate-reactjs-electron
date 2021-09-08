import { useState } from "react"

import "./Home.css"

const ipcRenderer = window.ipcRenderer

function Home() {

    const [text1, setText1] = useState("")
    const [text2, setText2] = useState("")
    const [disabled, setDisabled] = useState(true)

    const handleFileSave = () => {
        ipcRenderer.send("save-file", text1)
        setText1("")
    }

    const handleFileSave2 = () => {
        ipcRenderer.send("save-file", text2)
        setText2("")
    }

    const handleFileOpen = () => {
        setText2("")
        ipcRenderer.send("open-file", "enviei pra o main1")
        ipcRenderer.on("resp-main", (event, data) => {
            setText2(data)
        })
        setDisabled(false)
    }

    return (
        <>
            <h1>TXT Editor</h1>
            <h2>Create a file</h2>
            <textarea
                value={text1}
                onChange={e => setText1(e.target.value)}
            ></textarea>
            <button onClick={handleFileSave}>Save file as...</button>
            <h2>Open and edit a file</h2>
            <button onClick={handleFileOpen}>Open file...</button>
            <textarea
                value={text2}
                onChange={e => setText2(e.target.value)}
                disabled={disabled}
            ></textarea>
            <button onClick={handleFileSave2}>Save file as...</button>

        </>
    )
}

export default Home