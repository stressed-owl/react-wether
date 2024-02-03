import { Link } from "react-router-dom";
import { GlobalSvgSelector } from "../../assets/icons/global/GlobalSvgSelector";
import Button from "../../components/Button/Button";
import { optionType } from "../../interface/interface";
import styles from "./Header.module.scss";
import { ChangeEvent, useEffect, useState } from "react";

export const Header = (): JSX.Element => {
  const APP_API_KEY = process.env.APP_API_KEY;
  const [searchCity, setSearchCity] = useState<string>("");
  const [city, setCity] = useState<optionType | null>(null);
  const [options, setOptions] = useState<[]>([]);

  const getSearchOptions = (value: string) => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setOptions(data));
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchCity(value);
    if (value === "") return;
    getSearchOptions(value);
  };

  const getForecast = (city: optionType) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=matric&appid=${APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const onSubmit = () => {
    if (!city) return;

    getForecast(city);
  };

  const onOptionSelect = (option: optionType) => {
    setCity(option);
  };

  useEffect(() => {
    if (city) {
      setSearchCity(city.name);
      setOptions([]);
    }
  }, [city]);

  return (
    <header className={styles.header}>
      <Link className={styles.home_link} to="/">
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <GlobalSvgSelector id="header-logo" />
        </div>
        <div className={styles.title}>Weather ForeCasts</div>
      </div>
      </Link>
      <div className={styles.wrapper}>
        <div className={styles.change_theme}>
          <GlobalSvgSelector id="change_theme" />
        </div>
        <div className={styles.search}>
          <input
            className={styles.input}
            type="text"
            value={searchCity}
            onChange={onInputChange}
          />
          <ul>
            {options.map((option: optionType, index: number) => (
              <li key={option.name + "-" + index}>
                {" "}
                <button onClick={() => onOptionSelect(option)}>
                  {option.name}
                </button>
              </li>
            ))}
          </ul>
          <Button onClick={onSubmit}>Search</Button>
        </div>
      </div>
    </header>
  );
};