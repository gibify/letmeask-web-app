import { FormEvent, useState } from  'react';
import { Link, useHistory } from 'react-router-dom';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';

import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';

import '../../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('')

  const history = useHistory();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if(newRoom.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user,      
    });

    history.push(`/rooms/${firebaseRoom.key}`);

  }

  return (
    <div id="page-auth">

      <aside>
        <img src={illustrationImg} alt="ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Let me Ask" />
          <h2>Crie uma nova Sala</h2>
            <form onSubmit={handleCreateRoom}>
              <input 
              type="text" 
              placeholder="Nome da Sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
              />
              <Button type="submit">
                Criar Sala
              </Button>
            </form>
            <p>
              Quer entrar em uma sala existente? <Link to="/">Clique Aqui</Link>
            </p>
        </div>
      </main>

    </div>
  )
}