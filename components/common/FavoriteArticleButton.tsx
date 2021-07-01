import axios from "axios";
import React from "react";
import Router from "next/router";

import { SERVER_BASE_URL } from "lib/utils/constant";
import getLoggedInUser from "lib/utils/getLoggedInUser";

const FAVORITED_CLASS = "btn btn-sm btn-primary";
const NOT_FAVORITED_CLASS = "btn btn-sm btn-outline-primary";

const FavoriteArticleButton = (props) => {
  const loggedInUser = getLoggedInUser()
  const [favorited, setFavorited] = React.useState(props.favorited);
  const [favoritesCount, setFavoritesCount] = React.useState(props.favoritesCount);
  React.useEffect(() => {
    setFavorited(props.favorited);
    setFavoritesCount(props.favoritesCount);
  }, [props.favorited, props.favoritesCount])
  let buttonText;
  if (props.showText) {
    if (favorited) {
      buttonText = 'Unfavorite'
    } else {
      buttonText = 'Favorite'
    }
    buttonText += ' Article'
  } else {
    buttonText = ''
  }
  const handleClickFavorite = async () => {
    if (!loggedInUser) {
      Router.push(`/user/login`);
      return;
    }
    setFavorited(!favorited)
    setFavoritesCount(favoritesCount + (favorited ? - 1 : 1))
    try {
      if (favorited) {
        await axios.delete(`${SERVER_BASE_URL}/articles/${props.slug}/favorite`, {
          headers: {
            Authorization: `Token ${loggedInUser?.token}`,
          },
        });
      } else {
        await axios.post(
          `${SERVER_BASE_URL}/articles/${props.slug}/favorite`,
          {},
          {
            headers: {
              Authorization: `Token ${loggedInUser?.token}`,
            },
          }
        );
      }
    } catch (error) {
      setFavorited(!favorited)
      setFavoritesCount(favoritesCount + (favorited ? 1 : -1))
    }
  };
  return (
    <button
      className={
        favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS
      }
      onClick={() => handleClickFavorite()}
    >
      <i className="ion-heart" />{props.showText ? ' ' : ''}{buttonText} {props.showText ? '(' : ''}{favoritesCount}{props.showText ? ')' : ''}
    </button>
  )
}

export default FavoriteArticleButton;