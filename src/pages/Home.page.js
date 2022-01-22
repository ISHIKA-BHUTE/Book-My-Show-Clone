import React, {useState, useEffect} from "react";
import axios from "axios";
//components
import EntertainmentCardSlider from "../components/Entertainment/Entertainmentcard.component";
import Premier from "../components/Premier/Premier.component";

const HomePage = () => {
      const [popularMovies, setPopularMovies] = useState([]);
      useEffect(()=> {
        const requestPopularMovies = async () => {
          const getPopularMovies = await axios.get("/movie/popular");
          setPopularMovies(getPopularMovies.data.results);
        };
        requestPopularMovies();
      },[]);

      const [topRatedMovies, setTopRatedMovies] = useState([]);

      useEffect(() => {
        const requestTopRatedMovies = async () => {
          const getTopRatedMovies = await axios.get("/movie/top_rated");
          setTopRatedMovies(getTopRatedMovies.data.results);
      };
      requestTopRatedMovies();
   },[]);

     const [upcomingMovies, setUpcomingMovies] = useState([]);

     useEffect(() => {
       const requestUpcomingMovies = async () => {
         const getUpcomingMovies = await axios.get("/movie/upcoming");
         setUpcomingMovies(getUpcomingMovies.data.results);
     };
     requestUpcomingMovies();
   },[]);



  return (

    <>
    <div className="flex flex-col gap-9">

    <div className="container mx-auto px-32">
    <h1 className="text-2xl font-bold text-gray-900 my-3">
     The best of Entertainment
    </h1>
      <EntertainmentCardSlider />
    </div>



    <div className="bg-bms-700 py-16">
      <div className="mx-auto px-32 container">
        <img
          src="https://in.bmscdn.com/discovery-catalog/collections/tr:w-1440,h-120/premiere-rupay-banner-web-collection-202104230555.png"
          alt="Premier-Rupay"
          className="w-full h-full"
        />
      </div>
      <div className="container mx-auto px-32">
        <h3 className="text-white text-xl font-bold">Premieres</h3>
        <p className="text-white text-sm">Brand New releases every friday</p>
      </div>

      <div className="mx-auto px-32 container">
        <Premier  PremierImages={popularMovies}/>
      </div>
    </div>




    <div className="container mx-auto px-32">
      <h3 className="text-gray-900 text-xl font-bold ">Upcoming Events</h3>
    </div>
     <div className="mx-auto px-32 container">
        <Premier  PremierImages={upcomingMovies}/>
    </div>




    <div className="container mx-auto px-32">
      <h3 className="text-gray-900 text-xl font-bold">Top Rated</h3>
    </div>
     <div className="mx-auto px-32 container">
        <Premier  PremierImages={topRatedMovies}/>
    </div>



    </div>
    </>
  );
};

export default HomePage;
