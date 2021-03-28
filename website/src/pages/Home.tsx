import { IonCol, IonRow } from '@ionic/react';
import { Header, Footer, AppleBadge, GooglePlayBadge, SEO } from '../components'

import './Home.scss'
const Home: React.FC = () => {
  return (
    <>
      <SEO
        title='Accelerate Fitness: Track Workout & Add Logs'
        description='Track the statistics on your workouts, exercises, muscle groups and body measurements for any period of time and set new records. Interactive charts will help you understand your strengths and weaknesses to determine the future training plan. Analysis of your workout results will make your attending a gym more fun and productive.'
      />
      <Header />
      <div className='home'>
        {SectionData.map((d, i) => {
          return (
            <Section reverse={i % 2 != 0} key={d.id} {...d} />
          )
        })}
      </div>
      <Footer />
    </>
  );
};


function Section(props: {
  id: string,
  title: string,
  description: string,
  background?: string,
  mock: string,
  mockAlt: string,
  reverse?: boolean
}) {
  return (
    <section style={{ background: props.background }} id='hero'>
      <IonRow className={`row${props.reverse ? ' reverse' : ''}`}>
        <IonCol style={{ padding: '5%' }} size="12" sizeLg='6'>
          <h1>{props.title}</h1>
          <h6>{props.description}</h6>
          <IonRow>
            <IonCol >
              <GooglePlayBadge full={1} style={{ height: 70, width: 200 }} />
            </IonCol>
          </IonRow>
        </IonCol>
        <IonCol size="12" sizeLg='6'>
          <img className='mockup' src={props.mock} alt={props.mockAlt} />
        </IonCol>
      </IonRow>
    </section>
  )
}
export default Home;

const SectionData = [
  {
    id: 'hero',
    title: 'Accelerate your workout Goals',
    description: "Track the statistics on your workouts, exercises, muscle groups and body measurements for any period of time and set new records.",
    background: 'url(/assets/background/01.jpg)',
    mock: '/assets/mockups/01.png',
    mockAlt: "Workout Goals"
  },
  {
    id: 'logs',
    title: 'Workout log',
    description: "Track the statistics of your workout for any period of time. The charts will help you understand you progress over time, hence, helping you with easy progressive overloading, one of the key requirements for muscle growth",
    mock: '/assets/mockups/03.png',
    mockAlt: "Workout Logs"
  },
  {
    id: 'measurement',
    title: 'Measurement Logs',
    description: "How do you know if you are making progress? By tracking those numbers! Accelerate helps you with that as well. Log your weight, body fat percentage, muscle size and more. The charts will help you interpret the results.",
    mock: '/assets/mockups/04.png',
    background: 'url(/assets/background/02.jpg)',
    mockAlt: "Workout Goals"
  },
  {
    id: 'demos',
    title: 'Exercise demos',
    description: "Correct form is extremely crucial when it comes to weight training. This application provides the details, along with their visuals, for all the possible exercises you can think of.",
    mock: '/assets/mockups/02.png',
    mockAlt: "Exercise demos"
  }
]
