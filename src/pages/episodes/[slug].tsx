import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import {useRouter} from 'next/router';
import { api } from '../../services/api';
import { convertDurationToTimeStrings } from '../../utils/convertDurationToTimeStrings';


import styles from './episode.module.scss';
type Episode = {
    id: string;
    title: string;
    menbers: string;
    thumbnail: string;
    description: string;
    members: string;
    duration: string;
    durationAtString: string;
    url: string;
    published_at: string;
    publishedAt: string;
}
type EpisodeProps = {
    episode: Episode[];
}

export default function Episode({episode}: EpisodeProps){



    return(
       <div className={styles.episodes}>
           <div className={styles.thumbnailContainer}>
               <Link href="/">
                <button type="button">
                    <img src="/arrow-left.svg" alt="voltar"/>
                </button>
                </Link>
                <Image 
                    width = {700}
                    height ={160}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover" 
                    
                />
                 <button type="button">
                    <img src="/play.svg" alt="Reproduzir Podcast"/>
                </button>
           </div>
        <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.publishedAt}</span>
            <span>{episode.durationAtString}</span>
        </header>

        <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}/>
        
       </div>
    )
}

export const getStaticPaths: GetStaticPaths = async (ctx) =>{
    return{
        paths:[],
        fallback: 'blocking'
    }
}
export const getStaticProps: GetStaticProps = async (ctx) =>{
    const {slug} = ctx.params;
    const {data} = await api.get(`/episodes/${slug}`)
    
    const episode = {
        
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            members: data.members,
            publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
            duration: Number(data.file.duration),
            durationAtString: convertDurationToTimeStrings(Number(data.file.duration)),
            description: data.description,
            url: data.file.url,
      
    }
    return{
        props:{
            episode,
        },
        revalidate: 60*60 *24, //24hours
    }
}