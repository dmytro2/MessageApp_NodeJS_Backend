var formData = require('express-form-data');
app.use(formData.format());
// change file objects to node stream.Readable
app.use(formData.stream());
// union body and files
app.use(formData.parse());
app.use(formData.union());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* Upload provider profile image */
  router.post('/upload/userimage', function(req, res, next) {
    var files = req.files.ps_user_image;
    var oldpath = files[0].path;
    var file_id = createCode();
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(files[0].name);
    if (ext.length == 0) {
        ext = '.png';
    } else {
        ext = ext[0];
    }
    var file_name = createCode() + ext;//files[0].name.replace(/\s*/i, '_');

    console.log(file_name);

    var newpath = app.get('basePath') + '/public/uploaded/avatars/' + file_id + "_" + file_name;
    //var filepath = req.protocol + '://' + req.get('host') + '/uploaded/avatars/' + file_id + "_" + file_name;
    var filepath = '/uploaded/avatars/' + file_id + "_" + file_name;
    fs.readFile(oldpath, function (err, data) {
      if (err) {
        res.json({status: 'failed', data: 'No any uploaded file'});
        return;
      }
      // Write the file
      fs.writeFile(newpath, data, function (err) {
        if (err) {
          res.json({status: 'failed', data: 'Error in write file'});
          return;
        };
        res.json({status: 'success', data:{file_id: file_id, file_name: file_name, public_path: filepath, path: newpath}});
        console.log('File written!');
        return
      });

      // Delete the file
      fs.unlink(oldpath, function (err) {
        if (err) throw err;
        console.log('Temp file deleted!');
      });
    })