import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({email: "" , password: ""});
    let navigate = useNavigate();
    const handelLogin = async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email:credentials.email, password: credentials.password}),
        });
        const json = await response.json();
        console.log(json);
        if (json.success){
            // save the auth token and redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged in Successfully", "success");
            navigate("/");
        }
        else{
            props.showAlert("Invalid Details Entered", "danger");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }


    return (
        <div className='mt-3'>
            <h1 className='mb-5'>Login to see your Notes</h1>
            <form onSubmit={handelLogin}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} id="password" name="password"/>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}

export default Login
