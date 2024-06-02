import React, { useState, useEffect, useContext } from 'react';
import { TextField, Box, Button, Typography, styled, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';

const Component = styled(Box)`
    width: 400px;
    margin: auto;
    box-shadow: 5px 2px 5px 2px rgb(0 0 0 / 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px;
    box-sizing: border-box;
`;

const Image = styled('img')({
    width: 100,
    margin: '20px 0',
});

const Wrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    & > div, & > button, & > p {
        margin-top: 20px;
    }
`;

const CenteredBox = styled(Box)`
    display: flex;
    justify-content: center;
    margin: 20px 0;
    width: 100%;
`;

const LoginButton = styled(Button)`
    text-transform: none;
    background: #FB641B;
    color: #fff;
    height: 40px;
    border-radius: 2px;
    width: 100%;
`;

const SignupButton = styled(Button)`
    text-transform: none;
    background: #fff;
    color: #2874f0;
    height: 40px;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
    width: 100%;
`;

const Text = styled(Typography)`
    color: #878787;
    font-size: 12px;
    text-align: center;
`;

const Error = styled(Typography)`
    font-size: 10px;
    color: #ff6161;
    line-height: 0;
    margin-top: 10px;
    font-weight: 600;
`;

const loginInitialValues = {
    username: '',
    password: '',
    role: 'user'
};

const signupInitialValues = {
    name: '',
    username: '',
    password: '',
    role: 'user'
};

const Login = ({ isUserAuthenticated }) => {
    const [login, setLogin] = useState(loginInitialValues);
    const [signup, setSignup] = useState(signupInitialValues);
    const [error, showError] = useState('');
    const [account, toggleAccount] = useState('login');
    const [role, setRole] = useState('user');

    const navigate = useNavigate();
    const { setAccount } = useContext(DataContext);

    useEffect(() => {
        showError(false);
    }, [login]);

    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value, role });
    };

    const onInputChange = (e) => {
        setSignup({ ...signup, [e.target.name]: e.target.value, role });
    };

    const loginUser = async () => {
        let response = await API.userLogin(login);
        if (role === 'admin') {
            if (response.isSuccess) {
                showError('');
                sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
                sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
                setAccount({ name: response.data.name, username: response.data.username });
                isUserAuthenticated(true);
                setLogin(loginInitialValues);
                navigate('/');
            } else {
                showError('Something went wrong! Please try again later.');
            }
        } else {
            if (response.isSuccess) {
                showError('');
                sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
                sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
                setAccount({ name: response.data.name, username: response.data.username });
                isUserAuthenticated(true);
                setLogin(loginInitialValues);
                navigate('/');
            } else {
                showError('Something went wrong! Please try again later.');
            }
        }
    };

    const signupUser = async () => {
        let response = await API.userSignup(signup);
        if (response.isSuccess) {
            showError('');
            setSignup(signupInitialValues);
            toggleAccount('login');
        } else {
            showError('Something went wrong! Please try again later.');
        }
    };

    const toggleSignup = () => {
        account === 'signup' ? toggleAccount('login') : toggleAccount('signup');
    };

    return (
        <Component>
            <Image src="https://cdn-icons-png.flaticon.com/512/9746/9746847.png" alt="Electricity Management" />
            <Typography variant="h5" align="center">Electricity Management System</Typography>
            {account === 'login' && (
                <CenteredBox>
                    <Select value={role} onChange={(e) => setRole(e.target.value)} displayEmpty>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </CenteredBox>
            )}
            {account === 'login' ? (
                <Wrapper>
                    <TextField variant="standard" value={login.username} onChange={(e) => onValueChange(e)} name='username' label='Enter Username' fullWidth />
                    <TextField variant="standard" value={login.password} onChange={(e) => onValueChange(e)} name='password' label='Enter Password' fullWidth />
                    {error && <Error>{error}</Error>}
                    <LoginButton variant="contained" onClick={loginUser}>Login</LoginButton>
                    <Text>OR</Text>
                    <SignupButton onClick={toggleSignup}>Create an account</SignupButton>
                </Wrapper>
            ) : (
                <Wrapper>
                    <TextField variant="standard" onChange={(e) => onInputChange(e)} name='name' label='Enter Name' fullWidth />
                    <TextField variant="standard" onChange={(e) => onInputChange(e)} name='username' label='Enter Username' fullWidth />
                    <TextField variant="standard" onChange={(e) => onInputChange(e)} name='password' label='Enter Password' fullWidth />
                    <SignupButton onClick={signupUser}>Signup</SignupButton>
                    <Text>OR</Text>
                    <LoginButton variant="contained" onClick={toggleSignup}>Already have an account</LoginButton>
                </Wrapper>
            )}
        </Component>
    );
};

export default Login;
