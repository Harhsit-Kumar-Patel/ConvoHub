import React from 'react';

const SchoolAdminPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold font-heading">School Administration</h1>
      <p className="text-muted-foreground">This page is only visible to users with the role of 'Principal' or higher.</p>
    </div>
  );
};

export default SchoolAdminPage;