var mongoose = require('mongoose');
var sectionSchema = require('./section.schema.server');
var sectionModel = mongoose.model('SectionModel', sectionSchema);

function createSection(section) {
  return sectionModel.create(section);
}

function findSectionsForCourse(courseId) {
  return sectionModel.find({courseId: courseId});
}

function deleteById(sectionId){
  return sectionModel.deleteOne({_id:sectionId});
}
function decrementSectionSeats(sectionId) {
  return sectionModel.update({
    _id: sectionId
  }, {
    $inc: {seats: -1}
  });
}

function incrementSectionSeats(sectionId) {
  return sectionModel.update({
    _id: sectionId
  }, {
    $inc: {seats: +1}
  });
}
function updateSection(sectionId,section){
  return sectionModel.updateOne({_id:sectionId},section);
}
module.exports = {
  createSection: createSection,
  findSectionsForCourse: findSectionsForCourse,
  decrementSectionSeats: decrementSectionSeats,
  incrementSectionSeats: incrementSectionSeats,
  deleteById:deleteById,
    updateSection:updateSection
};