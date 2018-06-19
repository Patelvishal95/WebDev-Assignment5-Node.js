var mongoose = require('mongoose');
var enrollmentSchema = require('./enrollment.schema.server');
var enrollmentModel = mongoose.model(
  'EnrollmentModel',
  enrollmentSchema
);

function enrollStudentInSection(enrollment) {
  return enrollmentModel.create(enrollment);
}

function findSectionsForStudent(studentId) {
  return enrollmentModel
    .find({student: studentId})
    .populate('section')
    .exec();
}
function removeEnrollment(enrollmentId){
  return enrollmentModel.deleteOne({_id:enrollmentId});
}

module.exports = {
  enrollStudentInSection: enrollStudentInSection,
  findSectionsForStudent: findSectionsForStudent,
    removeEnrollment:removeEnrollment
};