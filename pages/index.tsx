import * as THREE from "three";
if (typeof document !== 'undefined') {
  //here `window` is available, so `window.document` (or simply `document`) is available too
}
// </Markers>

// <Label>
let labelDiv = document.getElementById("markerLabel");
let closeBtn = document.getElementById("closeButton");
closeBtn.addEventListener("pointerdown", event => {
  labelDiv.classList.add("hidden");
})
let label = new CSS2DObject(labelDiv);
label.userData = {
  cNormal: new THREE.Vector3(),
  cPosition: new THREE.Vector3(),
  mat4: new THREE.Matrix4(),
  trackVisibility: () => { // the closer to the edge, the less opacity
    let ud = label.userData;
    ud.cNormal.copy(label.position).normalize().applyMatrix3(globe.normalMatrix);
    ud.cPosition.copy(label.position).applyMatrix4(ud.mat4.multiplyMatrices(camera.matrixWorldInverse, globe.matrixWorld));
    let d = ud.cPosition.negate().normalize().dot(ud.cNormal);
    d = smoothstep(0.2, 0.7, d);
    label.element.style.opacity = d;
    
    // https://github.com/gre/smoothstep/blob/master/index.js
    function smoothstep (min: number, max: number, value: number) {
      var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
      return x*x*(3 - 2*x);
    };
  }
}
scene.add(label);
// </Label>

// <Interaction>
let pointer = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let intersections: string | any[];
let divID = document.getElementById("idNum");
let divMag = document.getElementById("magnitude");
let divCrd = document.getElementById("coordinates");
window.addEventListener("pointerdown", event => {
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  intersections = raycaster.intersectObject(markers).filter(m => {
    return (m.uv.subScalar(0.5).length() * 2) < 0.25; // check, if we're in the central circle only
  });
  //console.log(intersections);
  if (intersections.length > 0) {
    let iid = intersections[0].instanceId;
    let mi = markerInfo[iid];
    divID.innerHTML = `ID: <b>${mi.id}</b>`;
    divMag.innerHTML = `Mag: <b>${mi.mag}</b>`;
    divCrd.innerHTML = `X: <b>${mi.crd.x.toFixed(2)}</b>; Y: <b>${mi.crd.y.toFixed(2)}</b>; Z: <b>${mi.crd.z.toFixed(2)}</b>`;
    label.position.copy(mi.crd);
    label.element.animate([
      {width: "0px", height: "0px", marginTop: "0px", marginLeft: "0px"},
      {width: "230px", height: "50px", marginTop: "-25px", maginLeft: "120px"}
    ],{
      duration: 250
    });
    label.element.classList.remove("hidden");
  }
  
})
// </Interaction>

let clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  let t = clock.getElapsedTime();
  globalUniforms.time.value = t;
  label.userData.trackVisibility();
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
});

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);
  labelRenderer.setSize(innerWidth, innerHeight);
}

"use strict";

var GK = GK || {};

GK.LatLng = function(latitude: any, longitude: any) {
    this.latitude = latitude;
    this.longitude = longitude;
}

GK.LatLng.radiansForPosition = function(x: number, z: number) {
    if (z > 0) {
        if (x >= 0) {
            return Math.atan(x / z);
        }
        else {
            return 2 * Math.PI + Math.atan(x / z);
        }
    }
    else if (z < 0) {
        return Math.PI + Math.atan(x / z);
    }
    else {
        if (x > 0) {
            return Math.PI / 2.0;
        }
        else {
            return 3 * Math.PI / 2.0;
        }
    }
}

GK.LatLng.toWorld = function(latLng: { latitude: number; longitude: number; }) {
    var latRad = latLng.latitude * Math.PI / 180.0;
    var lngRad = latLng.longitude * Math.PI / 180.0;

    var radius = Math.cos(latRad);
    var y = Math.sin(latRad);
    var x = Math.sin(lngRad) * radius;
    var z = Math.cos(lngRad) * radius;

    return vec3.fromValues(x, y, z);
}

GK.LatLng.fromWorld = function(pos: any) {
    var normal = vec3.create();
    vec3.normalize(normal, pos);

    var latRad = Math.asin(normal.y);
    var lngRad = radiansForPosition(normal.x, normal.z);

    var lngDeg = lngRad * 180.0 / Math.PI;
    while (lngDeg > 180.0) {
        lngDeg -= 360.0;
    }

    return new GK.LatLng(latRad * 180.0 / Math.PI, lngDeg);
}

/*
mat4_t CEALatLng_getRotationMatrix(CEALatLng coords)
{
    mat4_t m = m4_rotation(M_PI * coords.longitude / 180.0, vec3(0.0, 1.0, 0.0)); // yaw
    m = m4_mul(m, m4_rotation(M_PI * coords.latitude / 180.0, vec3(-1.0, 0.0, 0.0))); // pitch
    m = m4_mul(m, m4_translation(vec3(0.0, 0.0, 1.0))); // assuming radius of 1
    return m;
}
*/
import * as React from "react";
import Head from "next/head";
import TweetEmbed from "react-tweet-embed";
import { useRouter } from "next/router";
import {
  CloudUploadIcon,
  CloudDownloadIcon,
  CodeIcon,
  ShareIcon,
} from "@heroicons/react/outline";
import { useDropzone } from "react-dropzone";

let Globe = () => null;
if (typeof window !== "undefined") Globe = require("react-globe.gl").default;

import { createClient } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";
import { DEG2RAD } from "three/src/math/MathUtils";

class Program
{
    public static Main(): void
    {
        let scene = new THREE.Scene();
        console.log(scene);
    }
}

const makeid = (length: number) => {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};
class CustomSinCurve extends THREE.Curve {
  [x: string]: number;

	constructor( scale = 1 ) {

		super();

		this.scale = scale;

	}

	getPoint( t: number, optionalTarget = new THREE.Vector3() ) {

		const tx = t * 3 - 1.5;
		const ty = Math.sin( 2 * Math.PI * t );
		const tz = 0;

		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );

	}

}


const path = new CustomSinCurve( 10 );
const geometry = new THREE.TubeGeometry( path, 20, 2, 8, false );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const mesh = new THREE.Mesh( geometry, material );
const arcsData = [1].map(() => ({
  startLat: (Math.random() - 0.5) * 40,
  startLng: (Math.random() - 0.5) * 90,
  endLat: (Math.random() - 0.5) * 40,
  endLng: (Math.random() - 0.5) * 90,
  color: [["#ffffff"][0], ["#ffffff"][0]],
}));



// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material );
const Home = () => {
  const [globeFile, setGlobeFile] = React.useState(null);
  const router = useRouter();
  const [imageUrl, setImageUrl] = React.useState("/images/texture.png");
  const globeRef: any = React.useRef(null);
  const inputRef: any = React.useRef(null);
  const linkRef: any = React.useRef(null);
  const arcsData = [1].map(() => ({
    startLat: (Math.random() - 0.5) * 40,
    startLng: (Math.random() - 0.5) * 90,
    endLat: (Math.random() - 0.5) * 40,
    endLng: (Math.random() - 0.5) * 90,
    color: [["#ffffff"][0], ["#ffffff"][0]],
  }));

  const processFile = (files: any[] | FileList) => {
    const data = URL.createObjectURL(files[0]);
    setImageUrl(data);
    setGlobeFile(files[0]);
  };

  const onDrop = React.useCallback((files) => {
    processFile(files);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="">
      <Head>
        <title>Globe 3D</title>
      </Head>

      <main className="" {...getRootProps()}>
          <nav className="bg-white">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="border-b border-gray-100">
                <div className="flex items-center justify-between h-16 px-4 sm:px-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-gray-900">
                      <a href="/">
                        <img
                          className="h-8 w-8"
                          src="/images/logoglobe.png"
                          alt="Globe 3D"
                        />
                      </a>
                    </div>
                    <div className="hidden md:flex flex-1">
                      <div className="ml-10 flex items-baseline space-x-4 justify-end items-end">
                        <a
                          href="https://figma.com/@sonny"
                          className="text-gray-900 hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          All Plugins
                        </a>
                        <a
                          href="https://twitter.com/sonnylazuardi"
                          className="text-gray-900 hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Twitter
                        </a>
                        <a
                          href="https://github.com/sonnylazuardi/globe-3d"
                          className="text-gray-900 hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Github
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="mt-16 pb-16">
            <div className="mx-auto max-w-7xl">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left lg:flex lg:items-center">
                  <div>
                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-black sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                      <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 md:block">
                      </span>
                    </h1>
                    <p className="mt-3 text-base text-gray-900 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      
                    </p>
                    <p className="mt-8 text-sm text-white uppercase tracking-wide font-semibold sm:mt-10 lg:justify-start md:justify-center flex flex-wrap">
                      <a
                      >
                      </a>
                      <a
                      >
                      </a>
                    </p>
                    <div className="py-6">
                      <p className="text-xs cursor-pointer hover:underline leading-5 text-gray-500">
                      </p>
                      <p className="text-xs leading-5 text-gray-500">
                        
                      </p>
                </div>
                <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-5 mx-auto px-5 relative">
                      <button
                        onClick={() => {
                          inputRef?.current.click();
                        }}
                        type="button"
                      >
                        <input
                          ref={inputRef}
                          onChange={(e) => processFile(e.target.files)}
                          type="file"
                          className="hidden"
                        />
                      </button>

                      {globeFile ? (
                        <>
                          <button
                            onClick={() => {
                              const canvas =
                                globeRef.current.renderer().domElement;
                              const link = linkRef.current;
                              link.setAttribute("download", "globe.png");
                              link.setAttribute(
                                "href",
                                canvas
                                  .toDataURL("image/png")
                                  .replace("image/png", "image/octet-stream")
                              );
                              link.click();
                            }}
                            type="button"
                            className="inline-flex justify-center items-center px-6 py-3 border text-blue-500 font-semibold rounded-md transition dutation-150 ease-in-out transform hover:scale-105 bg-white mb-2"
                          >
                          </button>
                          <button
                            onClick={async () => {
                              if (globeFile) {
                                const id = makeid(8);
                                const toastId = toast.loading(
                                  "Creating your globe URL"
                                );
                                const { data, error } = await supabase.storage
                                  .from("globe")
                                  .upload(`public/${id}.png`, globeFile);
                                if (!error) {
                                  console.log({ data });
                                  toast.success("Your globe URL is Ready", {
                                    id: toastId,
                                  });
                                  router.push(`share/${id}`);
                                }
                              }
                            }}
                            type="button"
                            className="inline-flex justify-center items-center px-6 py-3 border text-blue-500 font-semibold rounded-md transition dutation-150 ease-in-out transform hover:scale-105 bg-white mb-2"
                          >
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <Globe
                    //@ts-ignore
                    ref={globeRef}
                    width={800}
                    height={800}
                    backgroundColor={"rgba(0,0,0,0)"}
                    globeImageUrl={imageUrl}
                    arcColor={"color"}
                    arcsData={arcsData}
                    arcDashGap={0.6}
                    arcDashLength={0.3}
                    arcDashAnimateTime={4000 + 500}
                    rendererConfig={{ preserveDrawingBuffer: true }}
                  />
                  <a className="hidden" ref={linkRef} />
                </div>
              </div>
            </div>
            <div className="mt-24">
              <h2 className="text-gray-700 text-center text-3xl font-bold">
              </h2>
              <div className="pt-10">
                <div
                  style={{ width: 580, maxWidth: "100%" }}
                  className="mx-auto p-4"
                >
                  
                  
                </div>
              </div>
            </div>
            <div className="mt-24">
              <h2 className="text-gray-700 text-center text-3xl font-bold">
              </h2>
              <div className="p-4 text-center">
              </div>
              <div className="">
                <div
                  style={{ width: 580, maxWidth: "100%" }}
                  className="mx-auto p-4"
                >
                  


                  
                </div>
              </div>
            </div>
          </main>
          <body className="bg-gradient-to-r from-black to-black ...">
            <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
              <nav
                className="-mx-5 -my-2 flex flex-wrap justify-center"
                aria-label="Footer"
              >
                <div className="px-5 py-2">
                  <a
                    href="/"
                    className="text-base text-gray-200 hover:text-gray-100"
                  >
                    Home
                  </a>
                </div>
                <div className="px-5 py-2">
                  <a
                    href="https://twitter.com/sonnylazuardi"
                    className="text-base text-gray-200 hover:text-gray-100"
                  >
                    Twitter
                  </a>
                </div>
                <div className="px-5 py-2">
                  <a
                    href="https://github.com/sonnylazuardi/globe-3d"
                    className="text-base text-gray-200 hover:text-gray-100"
                  >
                    Github
                  </a>
                </div>
              </nav>
              <p className="mt-8 text-center text-base text-white">
              </p>
            </div>
          </body>
        {isDragActive ? (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center ">
            <p className="text-3xl text-white text-center font-bold">
            </p>
          </div>
        ) : null}
      </main>

      <footer className=""></footer>
      <Toaster />
    </div>
  );
};

export default Home;
function points(points: any): any {
  throw new Error("Function not implemented.");
}

function radiansForPosition(x: any, z: any) {
  throw new Error("Function not implemented.");
}

