import React, { useState, useEffect } from 'react';

import * as api from './api/apiService';
import Spinner from './components/Spinner';
import GradesControl from './components/GradesControl';
import ModalGrade from './components/ModalGrade';

export default function App() {
  const [allGrades, setAllGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getGrades = async () => {
      const grades = await api.getAllGrades();

      setTimeout(() => {
        setAllGrades(grades);
      }, 1000);
    };

    getGrades();
  }, []);

  const handleDelete = async (gradeToDelete) => {
    const isDeleted = await api.deleteGrade(gradeToDelete);

    if (isDeleted) {
      const deletedGradeIndex = allGrades.findIndex(
        (grade) => grade.id === gradeToDelete.id
      );

      const newGrades = Object.assign([], allGrades);
      newGrades[deletedGradeIndex].isDeleted = true;
      newGrades[deletedGradeIndex].value = 0;

      setAllGrades(newGrades);
      setIsModalOpen(false);
    }
  };

  const handlePersist = (grade) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const handlePersistData = (formData) => {
    const {id, newValue} = formData;
    const newGrades = Object.assign([], allGrades);
    const gradeToPersist = newGrades.find(grade => grade.id === id);
    gradeToPersist.value = newValue
    
    const addGrade = async () => {
      gradeToPersist.isDeleted = false;
      await api.insertGrades(gradeToPersist);
    };

    const editGrade = async () => {
      await api.updateGrade(gradeToPersist)
    }


    gradeToPersist.isDeleted ? addGrade() : editGrade()
    

    setIsModalOpen(false)
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="center">
      <h4>Controle de Notas</h4>

      {allGrades.length > 0 && (
        <GradesControl
          grades={allGrades}
          onDelete={handleDelete}
          onPersist={handlePersist}
        />
      )}
      {allGrades.length === 0 && <Spinner />}
      {isModalOpen && (
        <ModalGrade
          onSave={handlePersistData}
          onClose={handleClose}
          selectedGrade={selectedGrade}
        />
      )}
    </div>
  );
}
