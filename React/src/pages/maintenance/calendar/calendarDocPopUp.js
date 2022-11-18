import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import api from '../../../components/api/api';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SearchIcon from '@material-ui/icons/Search';

import Grid from '@material-ui/core/Grid';

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStylesGrid = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing(1),
    fontFamily:'Montserrat',
    color:'white',
    backgroundColor:'rgb(35,168,224)'
  },


}));

const defaultInput = {
  'UserID': '',
  'DCMUser': ''
}

export default function CalendarDialog(props) {
  const classesGrid = useStylesGrid();
  const [open, setOpen] = React.useState(false); // hook to open or close dialog on event click

  useEffect(() => { // runs everytime an event is clicked (toggle boolean prop value triggers this)

    setOpen(true);
    loadPdf();
  }, [props.toggleToTriggerOpenDialog])

  useEffect(() => { // on first load, we ensure dialog is closed (setOpen is false)

    setOpen(false);
  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => { // to close the dialog 
    setOpen(false);
    setFiles([]);
    setPdf();
    setPageNumber(1);
    setNumPages(null);
  };


  const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);

  const [files, setFiles] = React.useState([]); // holds files array (we will only have files[0])

  const fileUpload = async (e) => { // on change event for file input. Selected file from computer is stored in the hook
    setFiles(e.target.files);
  };

  const user = useSelector(store => store.user); // just to get the DCM User 

  const handleOk_Upload = async () => { // Uplaod button is clicked, file is uploaded in db

    if (files.length == 0 || files == "undefined") {
      window.alert("Please select a pdf file to upload.");
      // setOpen(false);
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = async (e) => {
      // console.warn(e.target.result);
      // const formData = { 'File': e.target.result };

      if (e.target.result.split(',')[0] !== "data:application/pdf;base64") { // check if file is pdf
        window.alert("Please select a pdf file to upload.");
        return;
      }

      input.DCMUser = user;
      input.pdf = e.target.result; // this is the file (we include application/base64 because react-pdf needs it, unlike images used earlier)
      input.id = props.selectedEventID;
      let body = new URLSearchParams(input);

      await api.post('/Maintenance/Calendar/AddFile', body).then(
        res => {
          let data = res.data;
          if (data !== "Event File has been uploaded.") {
            window.alert("Upload failed, please try again!");
            // setOpen(false);            
            return;
          } else {
            // upload succeeded, so we load pdf and display to user
            loadPdf();
          }
        }).catch(
          err => {
            // TODO: Error handling
            if (err.response) {
              window.alert("Upload failed, please try again!");
              
              return;
            }
            else {

            }
          }
        );
      
    };
  };


  //Handle Delete Event
  const handleDeleteEvent = async () => {
    const r = window.confirm("Would you like to remove this event?")
    if (r === true) {
      let body = new URLSearchParams({
        'id': props.selectedEventID, // event id is passed through props from parent (calendar.js)
        'DCMUser': user
      });
      await api.post('/Maintenance/Calendar/RemoveEvent', body).then(
        res => {
          let response = res.data;

          if (response === 'Event Removed') {
            setOpen(false); //close dialog
          }
          else {
          }
        }
      ).catch(
        err => { // TODO: Error handling
          console.log(err);
        }
      );


      // we get all events again and pass it to parent through callback fn to load updated events list on calendar
      api.post('/Maintenance/Calendar/GetEvents').then(
        res => {
          let data = res.data;
          data = data.map(x => {
            x.start = new Date(x.start);
            x.end = new Date(x.end);
            return x;
          });

          props.childHandler(data); // call back fn to parent with updated events list
        }).catch(
          err => {
            if (err.response) {
            }
            else {
            }
          }
        );
    }
  }

  //Display pdf
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdf, setPdf] = useState(); // the pdf file to display (base64)
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const loadPdf = () => {
    let body = new URLSearchParams({
      'DCMUser': user,
      'id': props.selectedEventID
    });

    api.post('/Maintenance/Calendar/GetEventPdf', body).then(
      res => {
        let data = res.data;
        setPdf(data[0].pdf); // put the loaded pdf in the hook
      }).catch(
        err => {
          if (err.response) {
          }
          else {
          }
        }
      );
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} style={{  fontFamily:'Montserrat'  }} aria-labelledby="form-dialog-title" fullScreen>
        <DialogTitle style={{ background: '#ffffff', color: 'black' ,   fontWeight:'bold' }}>{props.selectedEventTitle}</DialogTitle>
        <DialogContent style={{ background: '#ffffff' }}>
          <DialogContentText>
            <form>
              <FormControl style={{ width: '60%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
                <div className={classesGrid.root}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Button startIcon={<SearchIcon />}
                        variant="contained"
                        component="label"
                        style={{ background: "rgb(233,247,254)", width: '100%', fontFamily:'Montserrat' }}
                      >
                        Choose a File
                        <input
                          type="file"
                          name="file" accept="application/pdf" onChange={(e) => fileUpload(e)}
                          hidden
                        />
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        endIcon={<CloudUploadIcon style={{ color: "#3F00FF" }} />}
                        variant="contained"
                        component="label"
                        onClick={handleOk_Upload}
                        style={{ background: "rgb(233,247,254)", width: '100%', fontFamily:'Montserrat' }}
                      >
                        Upload
                      </Button>
                    </Grid>
                    <Grid item xs={12} style={{ fontFamily:'Montserrat'}}>
                      Upload .pdf file (meeting minutes or notes..)
                    </Grid>
                    <Grid item xs={12}>
                      <Button onClick={loadPdf} style={{ width: '100%', background: 'rgb(35,168,224)', color: 'white', fontFamily:'Montserrat' }}>View PDF</Button>
                    </Grid>
                    <Grid item xs={12}>
                      <div>
                        <Document
                          options={{
                            cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
                            cMapPacked: true,
                          }}
                          file={`data:application/pdf;base64${pdf}`}
                          onLoadSuccess={onDocumentLoadSuccess}
                        >
                          <Page pageNumber={pageNumber} />
                        </Document>
                        <div>
                          <p>
                            Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                          </p>
                          <Button
                            variant="contained"
                                 size="small"
                                 type="submit"
                                 className={classesGrid.button}
                                 disabled={pageNumber <= 1}
                                 onClick={previousPage}
                                   >Previous</Button>
                         
                          <Button
                            variant="contained"
                                 size="small"
                                 type="submit"
                                 className={classesGrid.button}
                                  disabled={pageNumber >= numPages}
                                  onClick={nextPage}
                                   >Next</Button>
                          {/* <button
                            type="button"
                            disabled={pageNumber >= numPages}
                            onClick={nextPage}
                          >
                            Next
                          </button> */}
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </div>

              </FormControl>
              {/* {pdfFileError && <div className='error-msg'>{pdfFileError}</div>} */}
              <br></br>
            </form>
            
          </DialogContentText>
        </DialogContent>

        <DialogActions style={{ background: '#ffffff' }}>

          <Button onClick={handleClose} style={{ color: 'black' ,  fontFamily:'Montserrat' }}>
            Cancel
          </Button>

          <Button onClick={handleDeleteEvent} style={{ color: 'black',  fontFamily:'Montserrat' }}>
            Delete Event
          </Button>
        </DialogActions>

      </Dialog>
    </div>
  );
}
