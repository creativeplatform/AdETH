import './App.css';
import React, { useState } from "react";
import Web3 from 'web3';
import AdEthNFTContract from './contracts/AdEthNFT.json';
import NFTDisplayer from "./components/NFTDisplayer";
import config from './config/config';

const adEthNFTAddress = config.web3.adEthNFTAddress;

function App() {
  const [uri, setUri] = useState("");
  const [adCaller, setAdCaller] = useState("");
  
  const getUri = async () => {
    const web3 = new Web3(window.ethereum);
    const AdEthNFTInstance = new web3.eth.Contract(AdEthNFTContract.abi, adEthNFTAddress);
    const retrievedUri = await AdEthNFTInstance.methods.uri().call();
    console.log("retrievedUri", retrievedUri);
    fetch(retrievedUri)
    .then(response => response.json())
    .then(json => {
      const lastPart = json.name.length + 5;
      let cleanUrl = json.image.slice(4, -lastPart);
      cleanUrl = cleanUrl + ".ipfs.dweb.link/" + json.name + ".jpg";
      console.log("cleanUrl", cleanUrl);
      setUri(cleanUrl);
    })
    // ipfs://bafybeicion5i2lindbbv7dbh3bluzl53vefwaxc23mft6qmasbjo7oq2fy/wwww.jpg
    // ://bafybeicion5i2lindbbv7dbh3bluzl53vefwaxc23mft6qmasbjo7oq2fy
    // https://bafybeigff6vzu56meekz7qog4blukwxygpv4wdmfq7ngsaf5xe4ztgu23m.ipfs.dweb.link/nike.jpg
  };

  const getAdCaller = async () => {
    const web3 = new Web3(window.ethereum);
    const AdEthNFTInstance = new web3.eth.Contract(AdEthNFTContract.abi, adEthNFTAddress);
    const response = await AdEthNFTInstance.methods.adCaller().call();
    setAdCaller(response);
  };
  
  return (
    <div className="App">
      <header className="App-header">
      <div >
        <h1 >Trendy Website !</h1>
        <div className="trendyParagraph">
          <h2>Moriatur, inquit.</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Si quae forte-possumus. Duo Reges: constructio interrete. Non igitur potestis voluptate omnia dirigentes aut tueri aut retinere virtutem. Teneo, inquit, finem illi videri nihil dolere. Quem Tiberina descensio festo illo die tanto gaudio affecit, quanto L. Cum sciret confestim esse moriendum eamque mortem ardentiore studio peteret, quam Epicurus voluptatem petendam putat. </p>
          <p>Sed in rebus apertissimis nimium longi sumus. Hic quoque suus est de summoque bono dissentiens dici vere Peripateticus non potest. Restincta enim sitis stabilitatem voluptatis habet, inquit, illa autem voluptas ipsius restinctionis in motu est. Ut nemo dubitet, eorum omnia officia quo spectare, quid sequi, quid fugere debeant? Multoque hoc melius nos veriusque quam Stoici. Qui non moveatur et offensione turpitudinis et comprobatione honestatis? Levatio igitur vitiorum magna fit in iis, qui habent ad virtutem progressionis aliquantum. Atqui, inquit, si Stoicis concedis ut virtus sola, si adsit vitam efficiat beatam, concedis etiam Peripateticis. </p>
        </div>
        <NFTDisplayer 
          uri={ uri } 
          getUri={ getUri }
          adCaller={ adCaller }
          getAdCaller={ getAdCaller }  
        />
        <div className="trendyParagraph">
          <h2>Quae quidem sapientes sequuntur duce natura tamquam videntes;</h2>
          <p>Ita similis erit ei finis boni, atque antea fuerat, neque idem tamen; Sed quid ages tandem, si utilitas ab amicitia, ut fit saepe, defecerit? Nihil enim iam habes, quod ad corpus referas; Quem Tiberina descensio festo illo die tanto gaudio affecit, quanto L. Quae si potest singula consolando levare, universa quo modo sustinebit? Nec vero hoc oratione solum, sed multo magis vita et factis et moribus comprobavit. </p>
          <p>Paria sunt igitur. At coluit ipse amicitias. Nam Metrodorum non puto ipsum professum, sed, cum appellaretur ab Epicuro, repudiare tantum beneficium noluisse; Videamus animi partes, quarum est conspectus illustrior; An quod ita callida est, ut optime possit architectari voluptates? Pisone in eo gymnasio, quod Ptolomaeum vocatur, unaque nobiscum Q. Si enim ad populum me vocas, eum. Nec vero sum nescius esse utilitatem in historia, non modo voluptatem. Quid autem habent admirationis, cum prope accesseris? At enim, qua in vita est aliquid mali, ea beata esse non potest. </p>
          <p>Iam illud quale tandem est, bona praeterita non effluere sapienti, mala meminisse non oportere? Sed haec ab Antiocho, familiari nostro, dicuntur multo melius et fortius, quam a Stasea dicebantur. Non enim iam stirpis bonum quaeret, sed animalis. Ego vero volo in virtute vim esse quam maximam; Inde sermone vario sex illa a Dipylo stadia confecimus. Inquit, dasne adolescenti veniam? Idemque diviserunt naturam hominis in animum et corpus. Cupiditates non Epicuri divisione finiebat, sed sua satietate. Rapior illuc, revocat autem Antiochus, nec est praeterea, quem audiamus. Qua igitur re ab deo vincitur, si aeternitate non vincitur? </p>
        </div>
      </div>
      </header>
    </div>
  );
}

export default App;
