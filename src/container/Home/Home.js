import React, { useState, useEffect } from "react";
import Product from "../../components/Product/Product";
import { Container, Grid, Segment, Dimmer, Loader } from "semantic-ui-react";
import "./Home.css";
import { db } from "../../Firebase/FirebaseConfig";

function Home() {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.collection("Products").onSnapshot((snapshot) => {
      setProduct(snapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    });



    // setTimeout(() => {
    //         setLoading(false);
    // }, 1000);
  }, [setProduct]);

  return (
    <div className="home">
      {loading ? (
        <Segment className="home__segment">
          <Dimmer active inverted>
            <Loader size="large" className="home__loaderMessage">
              Loading...
            </Loader>
          </Dimmer>
        </Segment>
      ) : (
        <Container>
          <Grid container columns={3} doubling stackable>
            {product.map((product, index) => {
              return (
                <Grid.Column stretched key={index}>
                  <Product
                    id={product.id}
                    key={product.id}
                    title={product.title}
                    price={product.price}
                    buyNowPrice={product.buyNowPrice}
                    rating={product.rating}
                    imageUrl={product.imageUrl}
                  ></Product>
                </Grid.Column>
              );
            })}

            <Grid.Column stretched key={"index"}>
              <Product
                id={"product.id"}
                key={"product.id"}
                title={"RTXX TIGERBYTE"}
                price={"100.000.000"}
                buyNowPrice={"100.000.000"}
                rating={"product.rating"}
                imageUrl={"https://scontent.fsgn2-6.fna.fbcdn.net/v/t1.6435-9/224312462_847159839544101_819576698287251221_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=dbeb18&_nc_ohc=1d6RMRJTCnAAX8PgGeA&_nc_ht=scontent.fsgn2-6.fna&oh=462b14d2fd59eb332843541e043bef09&oe=61949520"}
              ></Product>
            </Grid.Column>
          </Grid>
        </Container>
      )}
    </div>
  );
}

export default Home;
