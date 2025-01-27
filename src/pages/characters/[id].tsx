import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CharacterDetail } from '../../lib/type';
import { FiArrowLeft } from 'react-icons/fi';
import styles from '../../styles/characterDetail.module.css';

interface Props {
  character: CharacterDetail | null;
  page: number;
  name: string;
}

const CharacterDetailPage = ({ character, page, name }: Props) => {
  if (!character) {
    return <p>Personnage non trouvé</p>;
  }

  return (
    <div className={styles.container}>
      <Link href={`/characters?page=${page}&name=${name}`}>
        <p className={styles.backLink}>
          <FiArrowLeft size={24} className={styles.arrowIcon} />
          <span>Retour à la liste des personnages</span>
        </p>
      </Link>
      <h1 className={styles.title}>{character.name}</h1>
      <Image
        src={character.image}
        alt={character.name}
        width={300}
        height={300}
        className={styles.characterImage}
      />
      <p className={styles.text}><strong>Statut :</strong> {character.status}</p>
      <p className={styles.text}><strong>Espèce :</strong> {character.species}</p>
      <p className={styles.text}><strong>Origine :</strong> {character.origin.name}</p>
      <p className={styles.text}><strong>Nb Episode :</strong> {character.episode.length}</p>
      <p className={styles.text}><strong>Sexe :</strong> {character.gender}</p>
      <p className={styles.text}><strong>Localisation :</strong> {character.location.name}</p>
      <p className={styles.text}>
        <strong>Créé le </strong>
        {new Date(character.created).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        })}
      </p>

    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character/${params?.id}`
  );
  const character: CharacterDetail = await res.json();
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const name = query.name ? query.name as string : '';

  return {
    props: {
      character: character || null,
      page,
      name,
    },
  };
};

export default CharacterDetailPage;
