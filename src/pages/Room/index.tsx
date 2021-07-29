import { FormEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';

import logoImg from '../../assets/images/logo.svg';

import '../../styles/room.scss';

type FirebaseQuestion = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighLighted: boolean;
    isAnswered: boolean;
}>

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    
    const roomId = params.id;

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.once('value', room => {
            const databaseRoom = room.val();
            console.log(databaseRoom)
            // const firebaseQuestions: FirebaseQuestion = databaseRoom.questions ?? {};

            // const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
            //     return {
            //         id: key,
            //         content: value.content,
            //         author: value.author,
            //         isHighLighted: value.isHighLighted,
            //         isAnswered: value.isAnswered,
            //     };
            // }); 
            
            // console.log(parsedQuestions)
        });
    }, [roomId]);
    
    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === '') {
            return;
        };

        if(!user) {
            throw new Error('You must be logged in');
        };

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswered: false,
        };

        await database.ref(`/rooms/${roomId}/questions`).push(question);

        setNewQuestion('');
    };

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Let me ask" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main className="content">
                <div className="room-title">
                    <h1>Sala React</h1>
                    <span>4 perguntas</span>
                </div>

                <form onSubmit={handleSendQuestion}> 
                    <textarea
                     placeholder="O que você quer perguntar?"
                     onChange={event => setNewQuestion(event.target.value)}
                     value={newQuestion}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                            <img src={user.avatar} alt="foto"/>
                            <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        <Button>Enviar Pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    );
};