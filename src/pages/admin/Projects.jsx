import useTableData from '../../hooks/useTableData';
import TableComponent from './components/TableComponent';

const Projects = () => {
const { formattedData, loading } = useTableData({
    path: 'projects',
    sort: { field: 'title', direction: 'desc' },
  });

  const transform = {
   status: (value) => value,
 };

  const customHeaders = {
    academicYear: 'Academic Year',
    submissionDate: 'Submission Date',
  };

  const filterOut = ['documentUrl','published','abstract', 'keywords', 'studentId','description', 'createdAt','id', 'githubUrl', 'photoUrl'];

  return (
    <>
      {formattedData.length > 0 && (
      <TableComponent
      ItemData={formattedData}
      headers={Object.keys(formattedData[0])}
      title="Users"
      isLoading={loading}
      excludeFields={filterOut}
      transformFields={transform}
      headerLabels={customHeaders} // <- corrected prop name
    />
      )}
    </>
  );
}

export default Projects