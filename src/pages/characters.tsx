import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '../styles/characters.module.css';

interface Character {
  id: number;
  name: string;
  image: string;
}

interface PaginatedCharactersResponse {
  results: Character[];
  info: {
    pages: number;
    next: string | null;
    prev: string | null;
  };
}

interface Props {
  initialCharacters: Character[];
  initialTotalPages: number;
}

const Characters = ({ initialCharacters, initialTotalPages }: Props) => {
  const router = useRouter();
  const { page: queryPage, name: queryName } = router.query;

  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [searchTerm, setSearchTerm] = useState<string>(queryName ? String(queryName) : '');
  const [currentPage, setCurrentPage] = useState<number>(
    queryPage ? Number(queryPage) : 1
  );
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCharacters = async (page: number, searchQuery: string) => {
    setIsLoading(true);
    try {
      const query = `https://rickandmortyapi.com/api/character/?${searchQuery ? `name=${searchQuery}` : ''
        }${page ? `&page=${page}` : ''}`;
      const response = await fetch(query);
      if (!response.ok) throw new Error('Personnages introuvables');
      const data: PaginatedCharactersResponse = await response.json();
      setCharacters(data.results);
      setTotalPages(data.info.pages);
    } catch (error) {
      setCharacters([]);
      setTotalPages(1);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          page: currentPage,
          name: searchTerm,
        },
      },
      undefined,
      { shallow: true }
    );
  }, [currentPage, searchTerm, router]);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <input
          type="text"
          placeholder="Recherche..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchBox}
        />
        <h1 className={styles.title}>Personnages de Rick et Morty</h1>
      </div>

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className={styles.characterList}>
          {characters.length > 0 ? (
            characters.map((character) => (
              <div key={character.id} className={styles.characterCard}>
                <Image
                  src={character.image}
                  alt={character.name}
                  width={200}
                  height={200}
                  className={styles.characterImage}
                  loading="lazy"
                />
                <h3 className={styles.characterName}>{character.name}</h3>
                <Link
                  href={{
                    pathname: `/characters/${character.id}`,
                    query: { page: currentPage, name: searchTerm },
                  }}
                  passHref
                >
                  <p className={styles.linkButton}>Voir les détails</p>
                </Link>
              </div>
            ))
          ) : (
            <p>Aucun personnage trouvé</p>
          )}
        </div>
      )}

      <div className={styles.pagination}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Précédent
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Suivant
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { page = 1, name = '' } = context.query;

  const res = await fetch(
    `https://rickandmortyapi.com/api/character/?page=${page}&name=${name}`
  );
  const data: PaginatedCharactersResponse = await res.json();

  return {
    props: {
      initialCharacters: data.results,
      initialTotalPages: data.info.pages,
    },
  };
};

export default Characters;
