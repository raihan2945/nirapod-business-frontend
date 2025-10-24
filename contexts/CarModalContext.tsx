"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

const CarModalContext = createContext<any>(null);

export const CarModalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [carId, setCarId] = useState<string>("");
  const [fuelCarId, setFuelCarId] = useState<string>("");
  const [editFuelCarId, setEditFuelCarId] = useState<string>("");
  const [editTollCarId, setEditTollCarId] = useState<string>("");
  const [editParkingCarId, setEditParkingCarId] = useState<string>("");
  const [tollCarId, setTollCarId] = useState<string>("");
  const [parkingCarId, setParkingCarId] = useState<string>("");
  const [addFuelCar, setAddFuelCar] = useState<boolean>(false);
  const [addTollCar, setAddTollCar] = useState<boolean>(false);
  const [addParkingCar, setAddParkingCar] = useState<boolean>(false);
  const [addAllotmentCar, setAddAllotmentCar] = useState<boolean>(false);



  return (
    <CarModalContext.Provider
      value={{
        carId,
        fuelCarId,
        tollCarId,
        parkingCarId,
        addFuelCar,
        editFuelCarId,
        addTollCar,
        editTollCarId,
        addParkingCar,
        editParkingCarId,
        addAllotmentCar,
        setAddAllotmentCar,
        setEditParkingCarId,
        setAddParkingCar,
        setEditTollCarId,
        setAddTollCar,
        setEditFuelCarId,
        setCarId,
        setFuelCarId,
        setTollCarId,
        setParkingCarId,
        setAddFuelCar
      }}
    >
      {children}
    </CarModalContext.Provider>
  );
};

export const useCarModalContext = () => useContext(CarModalContext);
