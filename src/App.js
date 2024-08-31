import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

function App() {
  const [dogToShow, setDogToShow] = useState('https://i.postimg.cc/6pLpq7d0/dog-game.png');
  const [allBreeds, setAllBreeds] = useState([]);
  const [breedCorrect, setBreedCorrect] = useState('');
  const [fourOptions, setFourOptions] = useState(['A', 'B', 'C', 'D']);

  const [score, setScore] = useState(0);
  const [clickedYet, setClickedYet] = useState(false);
  const [correctDogImages, setCorrectDogImages] = useState({});

  const [selectedBreed, setSelectedBreed] = useState('');
  const [pictureCount, setPictureCount] = useState(3); 
  const [additionalPictures, setAdditionalPictures] = useState([]);
  const [win, setWin] = useState(false);


  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    fetch("https://dog.ceo/api/breeds/list/all", requestOptions)
      .then(response => response.json())
      .then(result => {
        setAllBreeds(Object.keys(result.message));
      })
      .catch(error => console.error(error));
  }, []); 

  useEffect(()=> {
    if(score >= 10) {
      setDogToShow('https://i.postimg.cc/FHQzCvSt/Correct-answer-2-2.png');
      setFourOptions(['A', 'B', 'C', 'D'])
      setWin(true)

    }
  },[score])

  useEffect(()=> {
    if(clickedYet) {
      setTimeout(() => {
        getDog();
      }, 1000);
    }
  },[clickedYet])

  const getDog = () => {
    
    if (score <10) {
      setClickedYet(false);
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      fetch("https://dog.ceo/api/breeds/image/random", requestOptions)
        .then(response => response.json())
        .then(result => {
          let fromURL = result.message.slice('https://images.dog.ceo/breeds/'.length).split('/')[0];
          const breed = fromURL.includes('-') ? fromURL.split('-')[0] : fromURL;
          console.log(breed)
          setDogToShow(result.message);
          setBreedCorrect(breed);
          if (allBreeds.includes(breed)) {
            makeFourOptionsList(breed);
          } else {
            console.error(`Breed ${breed} not found in allBreeds`);
          }
        })
        .catch(error => console.error(error));
      }
  };



  

  function makeFourOptionsList(breedCorrectFunc)  {
    let num0,num1,num2,num3=0;
    num0 = allBreeds.findIndex((x) => x===breedCorrectFunc)
    
    do {
      num1 = Math.floor(Math.random() * (allBreeds.length));
    } while (num1 === num0)

    do {
      num2 = Math.floor(Math.random() * (allBreeds.length));
    } while (num2 === num0 || num2 === num1)

    do {
      num3 = Math.floor(Math.random() * (allBreeds.length));
    } while (num3 === num0 || num3 === num1 || num3 === num2)
    
    let options = [num0, num1, num2, num3];

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    
    let finalOptions = [];
    for (let i=0; i<options.length; i++) {
      finalOptions.push(allBreeds[options[i]])
    }
    setFourOptions(finalOptions);

    console.log(num0)
    console.log(num1)
    console.log(num2)
    console.log(num3)
  }
  

const handleOptionClick = async (selectedBreed) => {
  

  if (selectedBreed === breedCorrect) {
    if (Object.keys(correctDogImages).length >= 5) {
      alert("Your answer is correct but you already have 5 dogs! Remove one if you want to add another.");
    }
    setScore(score + 2);
    if (Object.keys(correctDogImages).length < 5) {
      setCorrectDogImages({...correctDogImages,[selectedBreed]: dogToShow});
    }
  } else {
    setScore(Math.max(score - 1, 0));
  }

  if (score < 10) {
      setClickedYet(true);
  }
};



  const handleHintClick = () => {
    const wrongOptions = fourOptions.filter(option => option !== breedCorrect);
    if (wrongOptions.length > 0) {
      const randomWrongOption = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setFourOptions(fourOptions.filter(option => option !== randomWrongOption));
      setScore(Math.max(score - 1, 0));
    }
  };

  const handleDeleteClick = (breed) => {
    const updatedDogImages = { ...correctDogImages };
    delete updatedDogImages[breed];
    setCorrectDogImages(updatedDogImages);
  };

  const newGame = () => {
    setScore(0);
    setCorrectDogImages({});
    setWin(false);
    getDog();
  };

  const fetchAdditionalPictures = () => {
    fetch(`https://dog.ceo/api/breed/${selectedBreed}/images/random/${pictureCount}`)
      .then(response => response.json())
      .then(result => {
        setAdditionalPictures(result.message);
      })
      .catch(error => console.error('Error fetching pictures:', error));
  };

  return (
    <div className="App">
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{borderBottom: "2px solid brown"}}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dogs’ Identity Matters
          </Typography>
          <Button
            href="#"
            variant="outlined" 
            sx={{ my: 1, mx: 1.5 }}
            onClick={newGame}
          >
            NEW GAME
          </Button>
          <Button
            href="#"
            variant="outlined" 
            sx={{ my: 1, mx: 1.5, backgroundColor :  (score > 0) ? (score > 5 ? '#4D9B6C' : '#CA8D5A') : '#A85F5F',
              color :(score > 0) ? (score > 5 ? '#FFEB32' : '#62442F') : '#EBEBEB'
             }}
          >
            Score: {score}
          </Button>
          <Button
            href="#"
            variant="outlined"
            sx={{ my: 1, mx: 1.5 }}
            onClick={handleHintClick}


          >
            HINT
          </Button>
          
        </Toolbar>
      </AppBar>

      <Container  >
        <Grid
          container
          spacing={5}
          justifyContent="center"
          alignItems="flex-start"   
          sx={{ mt: 2 }}
        >
        
          <Card>
            <CardMedia
            component="img"
            height="400px"
            image = {dogToShow}
            style={score > 5  && score<10 && !clickedYet ? {height: '350px', objectFit: 'cover', objectPosition: 'center', clipPath: 'inset(45% 0% 45% 0%)' } : {} }
            />
          </Card>
        </Grid>

        <Grid
          container
          spacing={5}
          justifyContent="center"
          alignItems="flex-start"  
          sx={{ mt: 2 }} 
        >
          <ButtonGroup variant="contained" aria-label="Basic button group" spacing={5}>
          
          {fourOptions.map((option, index) => (
            <Button  key={index} onClick={() => {

              !clickedYet && handleOptionClick(option)
            }}
            sx = {{backgroundColor : clickedYet ? (option === breedCorrect ? "green" : "red" ) : '' }}
            
            >

              {option}
            </Button>
          ))}
          
          
          </ButtonGroup>
          
        </Grid>
        <Divider sx={{ mt: 2 }} />


        <Grid
          container
          spacing={2}
          justifyContent="left"
          alignItems="center"
          sx={{ mt: 1 }}
        >

          {Object.entries(correctDogImages).map(([breed, image], index) => (
            <Grid item key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="120"
                  image={image}
                />
                
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(breed)}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}



        </Grid>
        
        <Divider sx={{ mt: 2 }} />
        

        {win && (
        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="body1">Among those 5 dogs you have, which one is most likely pregnant now?</Typography>
          </Grid>
          <Grid item>
            <Select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              displayEmpty
            >
              {Object.keys(correctDogImages).map((breed, index) => (
                <MenuItem key={index} value={breed}>{breed}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Typography variant="body1">How many puppies do you think they are going to give birth to?</Typography>
          </Grid>
          <Grid item>
            <TextField
              type="number"
              onChange={(e) => setPictureCount(e.target.value)}
              sx={{ width: 80 }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={fetchAdditionalPictures}
              disabled={!selectedBreed || pictureCount <= 0}
            >
              See Your House In The Future
            </Button>
          </Grid>
          {additionalPictures.length > 0 && (
            <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
              {additionalPictures.map((imageUrl, index) => (
                <Grid item key={index}>
                  <Card>
                    <CardMedia component="img" height="100" image={imageUrl} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid> )}
        
      </Container>

      {!win && (
          <Card>
            <CardMedia
            component="img"
            height="160px"
            image = 'https://i.postimg.cc/05zXB8ZX/get-10-points-to-unblock-this-section.png'
            />
          </Card>
        )}

      <Box
        sx={{
          bgcolor: '#A85F5F',
          color: '#FFFFFF',
          py: 1,
          mt: 3,
          textAlign: 'center',
        }}
      >
        “Dog is God spelled backward.” – Duane Chapman
      </Box>
    </div>


    
  );
}


export default App;
