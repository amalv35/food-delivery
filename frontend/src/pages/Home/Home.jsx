import React, {useState} from 'react'
import "./home.css"
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import IntroAnimation from '../../components/IntroComponent/IntroComponent'
const Home = () => {
     const [category, setCategory] = useState("All")
  return (
    <>
    <IntroAnimation />
    <div>
        <Header />
         <ExploreMenu category={category} setCategory={setCategory} />
         <FoodDisplay category={category} />
    </div>
    </>
  )
}

export default Home