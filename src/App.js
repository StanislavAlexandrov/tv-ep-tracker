import React from 'react';
import { useEffect, useState, memo } from 'react';
import './App.css';
import QueryTest from './components/QueryTest';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function App() {
    const firebaseConfig = {
        apiKey: 'AIzaSyA5cKLtL2tHf8truxIy8ztrEyjIUZZ8LFM',
        authDomain: 'tveps-list.firebaseapp.com',
        projectId: 'tveps-list',
        storageBucket: 'tveps-list.appspot.com',
        messagingSenderId: '928099781835',
        appId: '1:928099781835:web:67bdb093b310e2d4bf5f4e',
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const queryClient = new QueryClient();
    const [list, setList] = useState();
    const [formReq, setFormReq] = useState('');

    const [reqLink, setReqLink] = useState(
        'https://api.tvmaze.com/singlesearch/shows?q=girls'
    );

    const [allEpsLink, setAllEpsLink] = useState(
        'https://api.tvmaze.com/shows/1/episodes'
    );

    const [allEps, setAllEps] = useState('');

    useEffect(() => {
        fetch(reqLink)
            .then((res) => res.json())
            .then((data) => setList(data));
    }, [reqLink]);

    useEffect(() => {
        fetch(allEpsLink)
            .then((res) => res.json())
            .then((data) => setAllEps(data));
    }, [allEpsLink]);

    const showId = list?.id;

    const handleChange = (e) => {
        setFormReq(e.target.value);
    };

    const handleClick = async () => {
        setReqLink('https://api.tvmaze.com/singlesearch/shows?q=' + formReq);

        setAllEpsLink('https://api.tvmaze.com/shows/' + showId + '/episodes');
        try {
            const docRef = await addDoc(collection(db, 'users'), {
                first: 'Ada',
                last: 'Lovelace',
                born: 1815,
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding document: ', e);
        }

        const querySnapshot = await getDocs(collection(db, 'users'));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    };

    const handleKeypress = (e) => {
        if (e.charCode === 13) {
            handleClick();
        }
    };

    return (
        <div className="flex justify-center">
            <div>
                <input
                    type="input"
                    onChange={handleChange}
                    onKeyPress={handleKeypress}
                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-blue-500 focus:border-blue-500  w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-8"
                ></input>
                <button type="button" onClick={handleClick}>
                    click
                </button>
                <div>{list && list.name}</div>
                <QueryClientProvider client={queryClient}>
                    <QueryTest reqLink={reqLink} />
                </QueryClientProvider>
                <div>
                    {allEps &&
                        allEps.map((ep) => (
                            <li>
                                s{ep.season < 10 ? '0' + ep.season : ep.season}e
                                {ep.number < 10 ? '0' + ep.number : ep.number} -{' '}
                                {ep.name}
                            </li>
                        ))}
                </div>
            </div>
        </div>
    );
}
