import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { CurrencyDollarIcon } from "@heroicons/react/solid";

export default function UpdateTrialModal({
    show,
    onHide,
    id
}) {

    async function UpdateTrial(e) {
        e.preventDefault();
        const { title, description, image, updateBTN, budget  } = e.target;
        var notificationSuccess = e.target.children[0].firstChild;
        var notificationError = e.target.children[0].lastChild;
        updateBTN.children[0].classList.remove("hidden")
        updateBTN.children[1].innerText = ""
        updateBTN.disabled = true;
        try {
            await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/UpdateTrial?idTXT=${id}&imageTXT=${encodeURIComponent(image.value)}&titleTXT=${encodeURIComponent(title.value)}&descriptionTXT=${encodeURIComponent(description.value)}&contributorsTXT=0&audienceTXT=0&budgetTXT=${budget.value}`, {
                "headers": {
                    "accept-language": "en-US,en;q=0.9",
                    "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
                },
                "body": null,
                "method": "GET"
            }).then(e2 => {
                notificationSuccess.style.display = "block";
                updateBTN.children[0].classList.add("hidden")
                updateBTN.children[1].innerText = "Update Trial"

                updateBTN.disabled = false;
            }).catch((error) => {
                notificationError.style.display = "none";
                updateBTN.children[0].classList.add("hidden");
                updateBTN.children[1].innerText = "Update Trial";
                updateBTN.disabled = false;
            });
        } catch (error) {

        }
        updateBTN.children[0].classList.add("hidden")
        updateBTN.children[1].innerText = "Update Trial";
        updateBTN.disabled = false;
    }

    async function LoadData() {
        
        await fetch(`https://cors-anyhere.herokuapp.com/https://wavedata.i.tgcloud.io:14240/restpp/query/WaveData/GetTrial?idTXT=${parseInt(id)}`, {
            "headers": {
                "accept-language": "en-US,en;q=0.9",
                "Authorization": "Bearer h6t28nnpr3e58pdm1c1miiei4kdcejuv",
            },
            "body": null,
            "method": "GET"
        }).then(e => {
            return e.json();
        }).then(e => {
            document.getElementById("updatetitle").value=e.results[0]['(SV)'][0].attributes.title
            document.getElementById("updatedescription").value=e.results[0]['(SV)'][0].attributes.description
            document.getElementById("updateimage").value=e.results[0]['(SV)'][0].attributes.image
            document.getElementById("updatebudget").value=e.results[0]['(SV)'][0].attributes.budget
            
        })
    }


    useEffect(async () => {
        await LoadData();
    }, [])

    return (
        <Modal
            show={show}
            onHide={onHide}
            onShow={()=>{LoadData()}}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header  >
                <Modal.Title id="contained-modal-title-vcenter">
                    Update Trial
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Form onSubmit={UpdateTrial}>
                    <Form.Group className="mb-3 grid" controlId="formGroupName">
                        <div id='notificationSuccess' name="notificationSuccess" style={{ display: 'none' }} className="mt-4 text-center bg-gray-200 relative text-gray-500 py-3 px-3 rounded-lg">
                            Success!
                        </div>
                        <div id='notificationError' name="notificationError" style={{ display: 'none' }} className="mt-4 text-center bg-red-200 relative text-red-600 py-3 px-3 rounded-lg">
                            Error! Please try again!
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 grid" controlId="formGroupName">
                        <Form.Label>Title</Form.Label>
                        <input required name="title" placeholder="Title" id="updatetitle" className="border rounded pt-2 pb-2 border-gray-400 pl-4 pr-4" />
                    </Form.Group>
                    <Form.Group className="mb-3 grid" controlId="formGroupName">
                        <Form.Label>Description</Form.Label>
                        <textarea required name="description" placeholder="Description" id="updatedescription" className="border rounded pt-2 pb-2 border-gray-400 pl-4 pr-4" />
                    </Form.Group>
                    <Form.Group className="mb-3 grid" controlId="formGroupName">
                        <Form.Label>Image</Form.Label>
                        <input required name="image" placeholder="Image link" id="updateimage" className="border rounded pt-2 pb-2 border-gray-400 pl-4 pr-4" />
                    </Form.Group>
                    <Form.Group className="mb-3 grid" controlId="formGroupName">
                        <Form.Label>Budget</Form.Label>
                        <div className="input-group">
                            <span className="input-group-addon text-sm pt-2 pb-2 pl-3 pr-3 font-normal -mr-1 leading-none text-gray-700 text-center bg-gray-200 border-gray-400 border rounded">
                                <CurrencyDollarIcon className="w-5 h-5 text-gray-500" />
                            </span>
                            <input required name="budget" placeholder="Budget" id="updatebudget" type='number' className="w-24 text-black pr-2 border-gray-400 border pl-2" />
                        </div>
                    </Form.Group>
                    <div className="d-grid">
                        <Button name="updateBTN" type='submit' style={{ 'display': 'flex' }} className='w-3/12 h-12 flex justify-center items-center' variant='outline-dark' >
                            <i id='LoadingICON' name='LoadingICON' className="select-none block w-12 m-0 fa fa-circle-o-notch fa-spin hidden"></i>
                            <span id='buttonText'>Update Trial</span>
                        </Button>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>

    );
}