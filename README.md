# MyProjects
Install Python dependencies for the FastAPI app
-> pip install -r bookstore/bookstore/requirements.txt

Start the FastAPI server
->cd bookstore/bookstore
->python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 

Install Node.js dependencies for the test suite
->cd ../tests
->npm install

Run the Playwright API tests
-> npm test

View the HTML test report
->npm run test:report

The report will open in your browser.
