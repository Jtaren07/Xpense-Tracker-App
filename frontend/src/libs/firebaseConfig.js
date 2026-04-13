/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCg6pc9y8yqHajPY2xot3428WiVWP8SzTE",
  authDomain: "expense-tracker-83cc9.firebaseapp.com",
  projectId: "expense-tracker-83cc9",
  storageBucket: "expense-tracker-83cc9.firebasestorage.app",
  messagingSenderId: "440653680387",
  appId: "1:440653680387:web:cb5a0b9a1f0efbc82c6336",
  measurementId: "G-DB8W3NV7RJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
