import "./App.scss";
import { useState, useEffect } from "react";
import axios from "axios";

const backend_base_url = "http://localhost:3044";
//import.meta.env.VITE_BACKEND_URL;
//console.log(backend_base_url);
//
//"http://localhost:3044/job-sources";

function App() {
    const [jobSources, setJobSources] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const userIsLoggedIn = () => {
        return Object.keys(currentUser).length > 0;
    };

    const getJobSources = () => {
        (async () => {
            setJobSources(
                (await axios.get(backend_base_url + "/job-sources")).data
            );
        })();
    };

    useEffect(() => {
        if (userIsLoggedIn()) {
            getJobSources();
        }
    }, []);

    const handleLoginButton = async (e) => {
        e.preventDefault();
        const response = await fetch(backend_base_url + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        setUsername("");
        setPassword("");

        if (response.ok) {
            const data = await response.json();
            getJobSources();
            setCurrentUser(data.user);
        } else {
            setMessage("bad login! LOSER");
        }
    };

    return (
        <div className="App">
            <h1>EJT Job Manager</h1>
            {userIsLoggedIn() ? (
                <>
                    <p>There are {jobSources.length} job sources:</p>
                    <ul>
                        {jobSources.map((jobSource, i) => {
                            return <li key={i}>{jobSource.name}</li>;
                        })}
                    </ul>
                </>
            ) : (
                <form className="login">
                    <div className="row">
                        username:{" "}
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                        />
                    </div>
                    <div className="row">
                        password:{" "}
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                        />
                    </div>

                    <div className="row">
                        <button onClick={handleLoginButton}>Login</button>
                    </div>
                    <div className="row">{message}</div>
                </form>
            )}
        </div>
    );
}

export default App;
