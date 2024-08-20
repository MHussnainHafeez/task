import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './App.css';

const items = [
  { id: 14864, name: "Recurring Item", category: null },
  { id: 14865, name: "Jasinthe Bracelet", category: { id: 14866, name: "Bracelets" } },
  { id: 14867, name: "Jasinthe Bracelet", category: { id: 14866, name: "Bracelets" } },
  { id: 14868, name: "Recurring Item with questions", category: null },
  { id: 14869, name: "Zero amount item with questions", category: null },
  { id: 14870, name: "Inspire Bracelet", category: { id: 14866, name: "Bracelets" } },
  { id: 14872, name: "Normal item with questions", category: null },
];

function App() {
  const [appliedTo, setAppliedTo] = useState('some');

  const initialValues = {
    applicableItems: []
  };

  const validationSchema = Yup.object({
    applicableItems: Yup.array().min(1, 'Please select at least one item')
  });

  const handleSubmit = (values) => {
    console.log("applied_to:", appliedTo);
    console.log("applicable_items:", values.applicableItems);
  };

  const renderItems = (values, setFieldValue) => {
    const categories = items.reduce((acc, item) => {
      const categoryName = item.category ? item.category.name : 'Uncategorized';
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(item);
      return acc;
    }, {});

    return Object.keys(categories).map((category) => (
      <div key={category} style={{ marginBottom: '10px' }}>
        <label>
          <Field
            type="checkbox"
            onClick={(e) => {
              const checked = e.target.checked;
              const itemIds = categories[category].map((item) => item.id);
              if (checked) {
                setFieldValue('applicableItems', [...values.applicableItems, ...itemIds]);
              } else {
                setFieldValue('applicableItems', values.applicableItems.filter(id => !itemIds.includes(id)));
              }
            }}
          />
          <span style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '3px' }}>
            {category}
          </span>
        </label>
        <div style={{ marginLeft: '20px' }}>
          {categories[category].map((item) => (
            <label key={item.id} style={{ display: 'block' }}>
              <Field
                type="checkbox"
                name="applicableItems"
                value={item.id}
                checked={values.applicableItems.includes(item.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFieldValue('applicableItems', [...values.applicableItems, item.id]);
                  } else {
                    setFieldValue('applicableItems', values.applicableItems.filter(id => id !== item.id));
                  }
                }}
                className={category.replace(/\s/g, '-')}
              />
              {item.name}
            </label>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <>
      <h1>Tax Form Application</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ marginRight: '10px' }}>
                <Field
                  type="radio"
                  name="appliedTo"
                  value="some"
                  checked={appliedTo === 'some'}
                  onChange={() => {
                    setAppliedTo('some');
                    setFieldValue('applicableItems', []);
                  }}
                />
                Apply to some items
              </label>
              <label>
                <Field
                  type="radio"
                  name="appliedTo"
                  value="all"
                  checked={appliedTo === 'all'}
                  onChange={() => {
                    setAppliedTo('all');
                    const allItemIds = items.map(item => item.id);
                    setFieldValue('applicableItems', allItemIds);
                  }}
                />
                Apply to all items
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              {renderItems(values, setFieldValue)}
            </div>

            <button type="submit">
              Apply to {values.applicableItems.length} item(s)
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default App;
