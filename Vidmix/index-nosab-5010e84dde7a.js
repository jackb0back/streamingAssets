var Module = typeof Module != "undefined" ? Module : {};
if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0
}
Module.expectedDataFileDownloads++;
(function() {
    if (Module["ENVIRONMENT_IS_PTHREAD"] || Module["$ww"]) return;
    var loadPackage = function(metadata) {
        var PACKAGE_PATH = "";
        if (typeof window === "object") {
            PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/")
        } else if (typeof process === "undefined" && typeof location !== "undefined") {
            PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/")
        }
        var PACKAGE_NAME = "index-nosab-5010e84dde7a.data";
        var REMOTE_PACKAGE_BASE = "index-nosab-5010e84dde7a.data";
        if (typeof Module["locateFilePackage"] === "function" && !Module["locateFile"]) {
            Module["locateFile"] = Module["locateFilePackage"];
            err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")
        }
        var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") : REMOTE_PACKAGE_BASE;
        var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];

        function fetchRemotePackage(packageName, packageSize, callback, errback) {
            if (typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string") {
                require("fs").readFile(packageName, function(err, contents) {
                    if (err) {
                        errback(err)
                    } else {
                        callback(contents.buffer)
                    }
                });
                return
            }
            var xhr = new XMLHttpRequest;
            xhr.open("GET", packageName, true);
            xhr.responseType = "arraybuffer";
            xhr.onprogress = function(event) {
                var url = packageName;
                var size = packageSize;
                if (event.total) size = event.total;
                if (event.loaded) {
                    if (!xhr.addedTotal) {
                        xhr.addedTotal = true;
                        if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
                        Module.dataFileDownloads[url] = {
                            loaded: event.loaded,
                            total: size
                        }
                    } else {
                        Module.dataFileDownloads[url].loaded = event.loaded
                    }
                    var total = 0;
                    var loaded = 0;
                    var num = 0;
                    for (var download in Module.dataFileDownloads) {
                        var data = Module.dataFileDownloads[download];
                        total += data.total;
                        loaded += data.loaded;
                        num++
                    }
                    total = Math.ceil(total * Module.expectedDataFileDownloads / num);
                    if (Module["setStatus"]) Module["setStatus"]("Downloading data... (" + loaded + "/" + total + ")")
                } else if (!Module.dataFileDownloads) {
                    if (Module["setStatus"]) Module["setStatus"]("Downloading data...")
                }
            };
            xhr.onerror = function(event) {
                throw new Error("NetworkError for: " + packageName)
            };
            xhr.onload = function(event) {
                if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || xhr.status == 0 && xhr.response) {
                    var packageData = xhr.response;
                    callback(packageData)
                } else {
                    throw new Error(xhr.statusText + " : " + xhr.responseURL)
                }
            };
            xhr.send(null)
        }

        function handleError(error) {
            console.error("package error:", error)
        }
        var fetchedCallback = null;
        var fetched = Module["getPreloadedPackage"] ? Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;
        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
            if (fetchedCallback) {
                fetchedCallback(data);
                fetchedCallback = null
            } else {
                fetched = data
            }
        }, handleError);

        function runWithFS() {
            function assert(check, msg) {
                if (!check) throw msg + (new Error).stack
            }
            Module["FS_createPath"]("/", "res", true, true);

            function DataRequest(start, end, audio) {
                this.start = start;
                this.end = end;
                this.audio = audio
            }
            DataRequest.prototype = {
                requests: {},
                open: function(mode, name) {
                    this.name = name;
                    this.requests[name] = this;
                    Module["addRunDependency"]("fp " + this.name)
                },
                send: function() {},
                onload: function() {
                    var byteArray = this.byteArray.subarray(this.start, this.end);
                    this.finish(byteArray)
                },
                finish: function(byteArray) {
                    var that = this;
                    Module["FS_createDataFile"](this.name, null, byteArray, true, true, true);
                    Module["removeRunDependency"]("fp " + that.name);
                    this.requests[this.name] = null
                }
            };
            var files = metadata["files"];
            for (var i = 0; i < files.length; ++i) {
                new DataRequest(files[i]["start"], files[i]["end"], files[i]["audio"] || 0).open("GET", files[i]["filename"])
            }

            function processPackageData(arrayBuffer) {
                assert(arrayBuffer, "Loading data file failed.");
                assert(arrayBuffer.constructor.name === ArrayBuffer.name, "bad input to processPackageData");
                var byteArray = new Uint8Array(arrayBuffer);
                DataRequest.prototype.byteArray = byteArray;
                var files = metadata["files"];
                for (var i = 0; i < files.length; ++i) {
                    DataRequest.prototype.requests[files[i].filename].onload()
                }
                Module["removeRunDependency"]("datafile_index-nosab-5010e84dde7a.data")
            }
            Module["addRunDependency"]("datafile_index-nosab-5010e84dde7a.data");
            if (!Module.preloadResults) Module.preloadResults = {};
            Module.preloadResults[PACKAGE_NAME] = {
                fromCache: false
            };
            if (fetched) {
                processPackageData(fetched);
                fetched = null
            } else {
                fetchedCallback = processPackageData
            }
        }
        if (Module["calledRun"]) {
            runWithFS()
        } else {
            if (!Module["preRun"]) Module["preRun"] = [];
            Module["preRun"].push(runWithFS)
        }
    };
    loadPackage({
        "files": [{
            "filename": "/res/.DS_Store",
            "start": 0,
            "end": 12292
        }, {
            "filename": "/res/RobotoBold.ttf",
            "start": 12292,
            "end": 148112
        }, {
            "filename": "/res/RobotoRegular.ttf",
            "start": 148112,
            "end": 293460
        }, {
            "filename": "/res/addframe.png",
            "start": 293460,
            "end": 296485
        }, {
            "filename": "/res/adler-f.png",
            "start": 296485,
            "end": 298793
        }, {
            "filename": "/res/albumsimple.png",
            "start": 298793,
            "end": 299069
        }, {
            "filename": "/res/animmodif.png",
            "start": 299069,
            "end": 304149
        }, {
            "filename": "/res/antonregular-f.png",
            "start": 304149,
            "end": 305577
        }, {
            "filename": "/res/apache.txt",
            "start": 305577,
            "end": 314705
        }, {
            "filename": "/res/arrowleft.png",
            "start": 314705,
            "end": 315516
        }, {
            "filename": "/res/arrowubackward.png",
            "start": 315516,
            "end": 316303
        }, {
            "filename": "/res/arrowuforward.png",
            "start": 316303,
            "end": 317181
        }, {
            "filename": "/res/badscriptregular-f.png",
            "start": 317181,
            "end": 319990
        }, {
            "filename": "/res/bahij-f.png",
            "start": 319990,
            "end": 322604
        }, {
            "filename": "/res/bc12.png",
            "start": 322604,
            "end": 337548
        }, {
            "filename": "/res/berkshireswashregular-f.png",
            "start": 337548,
            "end": 341061
        }, {
            "filename": "/res/bglayer.png",
            "start": 341061,
            "end": 345588
        }, {
            "filename": "/res/bin7.png",
            "start": 345588,
            "end": 346502
        }, {
            "filename": "/res/blendpic1.png",
            "start": 346502,
            "end": 422601
        }, {
            "filename": "/res/blendpic4.jpg",
            "start": 422601,
            "end": 434799
        }, {
            "filename": "/res/boxoutgoing.png",
            "start": 434799,
            "end": 435350
        }, {
            "filename": "/res/brownish.lut",
            "start": 435350,
            "end": 459926
        }, {
            "filename": "/res/brush0.png",
            "start": 459926,
            "end": 484252
        }, {
            "filename": "/res/brush10.png",
            "start": 484252,
            "end": 488968
        }, {
            "filename": "/res/brush14.png",
            "start": 488968,
            "end": 504154
        }, {
            "filename": "/res/brush15.png",
            "start": 504154,
            "end": 512179
        }, {
            "filename": "/res/brush17.png",
            "start": 512179,
            "end": 519030
        }, {
            "filename": "/res/brush2.png",
            "start": 519030,
            "end": 526912
        }, {
            "filename": "/res/brush20.png",
            "start": 526912,
            "end": 532348
        }, {
            "filename": "/res/brush21.png",
            "start": 532348,
            "end": 536583
        }, {
            "filename": "/res/brush22.png",
            "start": 536583,
            "end": 541076
        }, {
            "filename": "/res/brush23.png",
            "start": 541076,
            "end": 547627
        }, {
            "filename": "/res/brush26.png",
            "start": 547627,
            "end": 553029
        }, {
            "filename": "/res/brush27.png",
            "start": 553029,
            "end": 576788
        }, {
            "filename": "/res/brush28.png",
            "start": 576788,
            "end": 596271
        }, {
            "filename": "/res/brush3.png",
            "start": 596271,
            "end": 610131
        }, {
            "filename": "/res/brush32.png",
            "start": 610131,
            "end": 623664
        }, {
            "filename": "/res/brush33.png",
            "start": 623664,
            "end": 644132
        }, {
            "filename": "/res/brush34.png",
            "start": 644132,
            "end": 647120
        }, {
            "filename": "/res/brush4.png",
            "start": 647120,
            "end": 652821
        }, {
            "filename": "/res/brush8.png",
            "start": 652821,
            "end": 656153
        }, {
            "filename": "/res/brushicon_1x.png",
            "start": 656153,
            "end": 656769
        }, {
            "filename": "/res/brushicon_2x.png",
            "start": 656769,
            "end": 657759
        }, {
            "filename": "/res/bungeeregular-f.png",
            "start": 657759,
            "end": 659274
        }, {
            "filename": "/res/buttonjumpbackward.png",
            "start": 659274,
            "end": 661294
        }, {
            "filename": "/res/buttonjumpforward.png",
            "start": 661294,
            "end": 663197
        }, {
            "filename": "/res/buttonpause.png",
            "start": 663197,
            "end": 663351
        }, {
            "filename": "/res/buttonplay.png",
            "start": 663351,
            "end": 663824
        }, {
            "filename": "/res/buttonstepbackward.png",
            "start": 663824,
            "end": 665777
        }, {
            "filename": "/res/buttonstepforward.png",
            "start": 665777,
            "end": 667664
        }, {
            "filename": "/res/cabinsketchbold-f.png",
            "start": 667664,
            "end": 672948
        }, {
            "filename": "/res/camera.png",
            "start": 672948,
            "end": 673691
        }, {
            "filename": "/res/circleandtriangle.png",
            "start": 673691,
            "end": 677482
        }, {
            "filename": "/res/circlex.png",
            "start": 677482,
            "end": 679297
        }, {
            "filename": "/res/clearproject.png",
            "start": 679297,
            "end": 683341
        }, {
            "filename": "/res/closex.png",
            "start": 683341,
            "end": 686663
        }, {
            "filename": "/res/closex2.png",
            "start": 686663,
            "end": 690083
        }, {
            "filename": "/res/cloud7.png",
            "start": 690083,
            "end": 694025
        }, {
            "filename": "/res/colorpicker.png",
            "start": 694025,
            "end": 696345
        }, {
            "filename": "/res/creepsterregular-f.png",
            "start": 696345,
            "end": 699007
        }, {
            "filename": "/res/cross.png",
            "start": 699007,
            "end": 699551
        }, {
            "filename": "/res/curvedarrow.png",
            "start": 699551,
            "end": 717448
        }, {
            "filename": "/res/deleteframe.png",
            "start": 717448,
            "end": 721448
        }, {
            "filename": "/res/diamond.png",
            "start": 721448,
            "end": 722989
        }, {
            "filename": "/res/diskette-7.png",
            "start": 722989,
            "end": 723502
        }, {
            "filename": "/res/doublearrow.png",
            "start": 723502,
            "end": 732285
        }, {
            "filename": "/res/doublearrow2.png",
            "start": 732285,
            "end": 755367
        }, {
            "filename": "/res/doublesquares.png",
            "start": 755367,
            "end": 755672
        }, {
            "filename": "/res/duplicateframe.png",
            "start": 755672,
            "end": 758737
        }, {
            "filename": "/res/dynalightregular-f.png",
            "start": 758737,
            "end": 761448
        }, {
            "filename": "/res/emptysheet.png",
            "start": 761448,
            "end": 764990
        }, {
            "filename": "/res/emptysheet2.png",
            "start": 764990,
            "end": 768472
        }, {
            "filename": "/res/england-f.png",
            "start": 768472,
            "end": 773044
        }, {
            "filename": "/res/eraser2.png",
            "start": 773044,
            "end": 775227
        }, {
            "filename": "/res/eye7.png",
            "start": 775227,
            "end": 776768
        }, {
            "filename": "/res/faded.lut",
            "start": 776768,
            "end": 801344
        }, {
            "filename": "/res/film9.lut",
            "start": 801344,
            "end": 825920
        }, {
            "filename": "/res/filtericon_1x.png",
            "start": 825920,
            "end": 826557
        }, {
            "filename": "/res/filtericon_2x.png",
            "start": 826557,
            "end": 827550
        }, {
            "filename": "/res/fingerpaintregular-f.png",
            "start": 827550,
            "end": 831124
        }, {
            "filename": "/res/flag.png",
            "start": 831124,
            "end": 833821
        }, {
            "filename": "/res/folder_1x.png",
            "start": 833821,
            "end": 834326
        }, {
            "filename": "/res/folder_2x.png",
            "start": 834326,
            "end": 835267
        }, {
            "filename": "/res/folderarrow100.png",
            "start": 835267,
            "end": 837936
        }, {
            "filename": "/res/folderarrowout100.png",
            "start": 837936,
            "end": 841603
        }, {
            "filename": "/res/fonts.json",
            "start": 841603,
            "end": 853788
        }, {
            "filename": "/res/fpsicon.png",
            "start": 853788,
            "end": 855092
        }, {
            "filename": "/res/frosted.lut",
            "start": 855092,
            "end": 879668
        }, {
            "filename": "/res/fruitsj.jpg",
            "start": 879668,
            "end": 950349
        }, {
            "filename": "/res/galleryfolder.png",
            "start": 950349,
            "end": 955129
        }, {
            "filename": "/res/germaniaoneregular-f.png",
            "start": 955129,
            "end": 957600
        }, {
            "filename": "/res/gif_1x.png",
            "start": 957600,
            "end": 957918
        }, {
            "filename": "/res/gif_2x.png",
            "start": 957918,
            "end": 958361
        }, {
            "filename": "/res/giflayers.png",
            "start": 958361,
            "end": 969602
        }, {
            "filename": "/res/giphylogo.png",
            "start": 969602,
            "end": 975753
        }, {
            "filename": "/res/goldrange.lut",
            "start": 975753,
            "end": 1000329
        }, {
            "filename": "/res/halfarrowleft.png",
            "start": 1000329,
            "end": 1000781
        }, {
            "filename": "/res/handleeregular-f.png",
            "start": 1000781,
            "end": 1002892
        }, {
            "filename": "/res/hennypennyregular-f.png",
            "start": 1002892,
            "end": 1006459
        }, {
            "filename": "/res/hypnosis.lut",
            "start": 1006459,
            "end": 1031035
        }, {
            "filename": "/res/iosexport.png",
            "start": 1031035,
            "end": 1034081
        }, {
            "filename": "/res/iosexport2.png",
            "start": 1034081,
            "end": 1034632
        }, {
            "filename": "/res/kellyslabregular-f.png",
            "start": 1034632,
            "end": 1036511
        }, {
            "filename": "/res/lasso.png",
            "start": 1036511,
            "end": 1038376
        }, {
            "filename": "/res/layerdown7.png",
            "start": 1038376,
            "end": 1039680
        }, {
            "filename": "/res/lemonregular-f.png",
            "start": 1039680,
            "end": 1041837
        }, {
            "filename": "/res/limelight-f.png",
            "start": 1041837,
            "end": 1043782
        }, {
            "filename": "/res/lintsec-f.png",
            "start": 1043782,
            "end": 1046202
        }, {
            "filename": "/res/magnifying3.png",
            "start": 1046202,
            "end": 1047583
        }, {
            "filename": "/res/magnifyingglass.png",
            "start": 1047583,
            "end": 1049196
        }, {
            "filename": "/res/marckscriptregular-f.png",
            "start": 1049196,
            "end": 1052247
        }, {
            "filename": "/res/masking.png",
            "start": 1052247,
            "end": 1055829
        }, {
            "filename": "/res/mobile-7.png",
            "start": 1055829,
            "end": 1056393
        }, {
            "filename": "/res/newlayer.png",
            "start": 1056393,
            "end": 1060345
        }, {
            "filename": "/res/newrockerregular-f.png",
            "start": 1060345,
            "end": 1063220
        }, {
            "filename": "/res/nightcrawler.lut",
            "start": 1063220,
            "end": 1087796
        }, {
            "filename": "/res/nounbrush329832.png",
            "start": 1087796,
            "end": 1091239
        }, {
            "filename": "/res/nounbrush329832m.png",
            "start": 1091239,
            "end": 1096756
        }, {
            "filename": "/res/nounbrush329832ma.png",
            "start": 1096756,
            "end": 1104016
        }, {
            "filename": "/res/nounbrush329832t.png",
            "start": 1104016,
            "end": 1109738
        }, {
            "filename": "/res/nouncolor1958303.png",
            "start": 1109738,
            "end": 1112748
        }, {
            "filename": "/res/nounduplicate1801459.png",
            "start": 1112748,
            "end": 1115546
        }, {
            "filename": "/res/nounedit2038401.png",
            "start": 1115546,
            "end": 1121954
        }, {
            "filename": "/res/nounerase2407244.png",
            "start": 1121954,
            "end": 1122919
        }, {
            "filename": "/res/nounfilter2200387.png",
            "start": 1122919,
            "end": 1125198
        }, {
            "filename": "/res/nounflip340556v2.png",
            "start": 1125198,
            "end": 1129980
        }, {
            "filename": "/res/nounfont2785943.png",
            "start": 1129980,
            "end": 1131314
        }, {
            "filename": "/res/nounfont2785943v2.png",
            "start": 1131314,
            "end": 1134293
        }, {
            "filename": "/res/noungear70781.png",
            "start": 1134293,
            "end": 1143186
        }, {
            "filename": "/res/nounhalftonepattern461484.png",
            "start": 1143186,
            "end": 1145049
        }, {
            "filename": "/res/nouninfo1174604.png",
            "start": 1145049,
            "end": 1152619
        }, {
            "filename": "/res/nouninfo1174604_whbg.png",
            "start": 1152619,
            "end": 1155919
        }, {
            "filename": "/res/nounline1455139.png",
            "start": 1155919,
            "end": 1159583
        }, {
            "filename": "/res/nounmotion1705281.png",
            "start": 1159583,
            "end": 1162643
        }, {
            "filename": "/res/nounmove1155475.png",
            "start": 1162643,
            "end": 1163701
        }, {
            "filename": "/res/nounmusic3024549.png",
            "start": 1163701,
            "end": 1166427
        }, {
            "filename": "/res/nounpaintpalette1239359.png",
            "start": 1166427,
            "end": 1168439
        }, {
            "filename": "/res/nounphoto1088271.png",
            "start": 1168439,
            "end": 1171866
        }, {
            "filename": "/res/nounphoto1088271b.png",
            "start": 1171866,
            "end": 1176254
        }, {
            "filename": "/res/nounshapeedit2658382.png",
            "start": 1176254,
            "end": 1180907
        }, {
            "filename": "/res/nounsmudge177542.png",
            "start": 1180907,
            "end": 1186865
        }, {
            "filename": "/res/nounspeed3012376.png",
            "start": 1186865,
            "end": 1188168
        }, {
            "filename": "/res/nountext1271721.png",
            "start": 1188168,
            "end": 1189157
        }, {
            "filename": "/res/nountext1271721v2.png",
            "start": 1189157,
            "end": 1192216
        }, {
            "filename": "/res/nountext260345t.png",
            "start": 1192216,
            "end": 1192961
        }, {
            "filename": "/res/nountext89030.png",
            "start": 1192961,
            "end": 1193703
        }, {
            "filename": "/res/nounupgrade330602.png",
            "start": 1193703,
            "end": 1197385
        }, {
            "filename": "/res/nounvideo2953963.png",
            "start": 1197385,
            "end": 1200844
        }, {
            "filename": "/res/nounvolume1932417v2.png",
            "start": 1200844,
            "end": 1205441
        }, {
            "filename": "/res/ofl.txt",
            "start": 1205441,
            "end": 1209570
        }, {
            "filename": "/res/oldstamper-f.png",
            "start": 1209570,
            "end": 1214898
        }, {
            "filename": "/res/opacityicon.png",
            "start": 1214898,
            "end": 1216142
        }, {
            "filename": "/res/opacityicon2.png",
            "start": 1216142,
            "end": 1217167
        }, {
            "filename": "/res/orbitronblack-s.png",
            "start": 1217167,
            "end": 1218311
        }, {
            "filename": "/res/orbitronbold-s.png",
            "start": 1218311,
            "end": 1219269
        }, {
            "filename": "/res/orbitronlight-s.png",
            "start": 1219269,
            "end": 1220261
        }, {
            "filename": "/res/orbitronmedium-f.png",
            "start": 1220261,
            "end": 1221618
        }, {
            "filename": "/res/orbitronmedium-s.png",
            "start": 1221618,
            "end": 1222860
        }, {
            "filename": "/res/oswaldbold-s.png",
            "start": 1222860,
            "end": 1223953
        }, {
            "filename": "/res/oswaldbolditalic700-s.png",
            "start": 1223953,
            "end": 1226026
        }, {
            "filename": "/res/oswaldextralight-s.png",
            "start": 1226026,
            "end": 1227794
        }, {
            "filename": "/res/oswaldextralightitalic200-s.png",
            "start": 1227794,
            "end": 1230674
        }, {
            "filename": "/res/oswaldheavyitalic-s.png",
            "start": 1230674,
            "end": 1232244
        }, {
            "filename": "/res/oswaldheavyitalic800-s.png",
            "start": 1232244,
            "end": 1234459
        }, {
            "filename": "/res/oswaldlight-s.png",
            "start": 1234459,
            "end": 1235692
        }, {
            "filename": "/res/oswaldmedium-s.png",
            "start": 1235692,
            "end": 1237076
        }, {
            "filename": "/res/oswaldregular-f.png",
            "start": 1237076,
            "end": 1239035
        }, {
            "filename": "/res/oswaldregular-s.png",
            "start": 1239035,
            "end": 1240746
        }, {
            "filename": "/res/oswaldregularitalic-f.png",
            "start": 1240746,
            "end": 1242838
        }, {
            "filename": "/res/oswaldregularitalic-s.png",
            "start": 1242838,
            "end": 1245528
        }, {
            "filename": "/res/oswaldregularitalic400-s.png",
            "start": 1245528,
            "end": 1248177
        }, {
            "filename": "/res/oswaldsemibold-s.png",
            "start": 1248177,
            "end": 1249878
        }, {
            "filename": "/res/pac-f.png",
            "start": 1249878,
            "end": 1250763
        }, {
            "filename": "/res/pencil.png",
            "start": 1250763,
            "end": 1252073
        }, {
            "filename": "/res/pencil7.png",
            "start": 1252073,
            "end": 1252909
        }, {
            "filename": "/res/pexelslogo.png",
            "start": 1252909,
            "end": 1257833
        }, {
            "filename": "/res/photo7.png",
            "start": 1257833,
            "end": 1258850
        }, {
            "filename": "/res/photoicon.png",
            "start": 1258850,
            "end": 1262529
        }, {
            "filename": "/res/photoicon2.png",
            "start": 1262529,
            "end": 1266302
        }, {
            "filename": "/res/playfast.png",
            "start": 1266302,
            "end": 1266863
        }, {
            "filename": "/res/playicon.png",
            "start": 1266863,
            "end": 1269451
        }, {
            "filename": "/res/playslow.png",
            "start": 1269451,
            "end": 1269829
        }, {
            "filename": "/res/plus.png",
            "start": 1269829,
            "end": 1270099
        }, {
            "filename": "/res/plust.png",
            "start": 1270099,
            "end": 1271523
        }, {
            "filename": "/res/recordicon2_2x.png",
            "start": 1271523,
            "end": 1272383
        }, {
            "filename": "/res/recyclebin.png",
            "start": 1272383,
            "end": 1272696
        }, {
            "filename": "/res/recyclebin2.png",
            "start": 1272696,
            "end": 1274648
        }, {
            "filename": "/res/resizef.png",
            "start": 1274648,
            "end": 1277463
        }, {
            "filename": "/res/robotobold-s.png",
            "start": 1277463,
            "end": 1278676
        }, {
            "filename": "/res/robotoregular-f.png",
            "start": 1278676,
            "end": 1280511
        }, {
            "filename": "/res/robotoregular-s.png",
            "start": 1280511,
            "end": 1282165
        }, {
            "filename": "/res/rotatelandscape.png",
            "start": 1282165,
            "end": 1283055
        }, {
            "filename": "/res/rubikblack-s.png",
            "start": 1283055,
            "end": 1284388
        }, {
            "filename": "/res/rubikblackitalic-s.png",
            "start": 1284388,
            "end": 1286751
        }, {
            "filename": "/res/rubikbold-s.png",
            "start": 1286751,
            "end": 1287925
        }, {
            "filename": "/res/rubikbolditalic-s.png",
            "start": 1287925,
            "end": 1290152
        }, {
            "filename": "/res/rubikitalic-s.png",
            "start": 1290152,
            "end": 1291760
        }, {
            "filename": "/res/rubiklight-s.png",
            "start": 1291760,
            "end": 1293019
        }, {
            "filename": "/res/rubiklightitalic-s.png",
            "start": 1293019,
            "end": 1295411
        }, {
            "filename": "/res/rubikmedium-s.png",
            "start": 1295411,
            "end": 1296953
        }, {
            "filename": "/res/rubikmediumitalic-s.png",
            "start": 1296953,
            "end": 1299780
        }, {
            "filename": "/res/rubikregular-f.png",
            "start": 1299780,
            "end": 1301396
        }, {
            "filename": "/res/rubikregular-s.png",
            "start": 1301396,
            "end": 1303161
        }, {
            "filename": "/res/sanchezitalic-s.png",
            "start": 1303161,
            "end": 1304711
        }, {
            "filename": "/res/sanchezregular-f.png",
            "start": 1304711,
            "end": 1306893
        }, {
            "filename": "/res/sanchezregular-s.png",
            "start": 1306893,
            "end": 1308706
        }, {
            "filename": "/res/shapesicon_1x.png",
            "start": 1308706,
            "end": 1309171
        }, {
            "filename": "/res/shapesicon_2x.png",
            "start": 1309171,
            "end": 1309711
        }, {
            "filename": "/res/sliders.png",
            "start": 1309711,
            "end": 1310024
        }, {
            "filename": "/res/slimjim-f.png",
            "start": 1310024,
            "end": 1311316
        }, {
            "filename": "/res/sling-f.png",
            "start": 1311316,
            "end": 1313173
        }, {
            "filename": "/res/sling-s.png",
            "start": 1313173,
            "end": 1314931
        }, {
            "filename": "/res/slingbold-s.png",
            "start": 1314931,
            "end": 1316331
        }, {
            "filename": "/res/slinglight-s.png",
            "start": 1316331,
            "end": 1317766
        }, {
            "filename": "/res/smartphone.png",
            "start": 1317766,
            "end": 1318238
        }, {
            "filename": "/res/speakerno_80px.png",
            "start": 1318238,
            "end": 1320182
        }, {
            "filename": "/res/specialelite-f.png",
            "start": 1320182,
            "end": 1323695
        }, {
            "filename": "/res/splitscreen2.png",
            "start": 1323695,
            "end": 1326755
        }, {
            "filename": "/res/squadaoneregular-f.png",
            "start": 1326755,
            "end": 1328395
        }, {
            "filename": "/res/tangerinebold-s.png",
            "start": 1328395,
            "end": 1329871
        }, {
            "filename": "/res/tangerineregular-f.png",
            "start": 1329871,
            "end": 1331815
        }, {
            "filename": "/res/tangerineregular-s.png",
            "start": 1331815,
            "end": 1333544
        }, {
            "filename": "/res/textaligncenter.png",
            "start": 1333544,
            "end": 1336455
        }, {
            "filename": "/res/textalignfixwidth.png",
            "start": 1336455,
            "end": 1339342
        }, {
            "filename": "/res/textalignjustify.png",
            "start": 1339342,
            "end": 1342236
        }, {
            "filename": "/res/textalignleft.png",
            "start": 1342236,
            "end": 1345136
        }, {
            "filename": "/res/textalignright.png",
            "start": 1345136,
            "end": 1348038
        }, {
            "filename": "/res/texticon2_1x.png",
            "start": 1348038,
            "end": 1348285
        }, {
            "filename": "/res/texticon2_2x.png",
            "start": 1348285,
            "end": 1348557
        }, {
            "filename": "/res/texticon_1x.png",
            "start": 1348557,
            "end": 1349089
        }, {
            "filename": "/res/texticon_2x.png",
            "start": 1349089,
            "end": 1350046
        }, {
            "filename": "/res/textintransition.png",
            "start": 1350046,
            "end": 1354695
        }, {
            "filename": "/res/textouttransition.png",
            "start": 1354695,
            "end": 1359349
        }, {
            "filename": "/res/thriller.lut",
            "start": 1359349,
            "end": 1383925
        }, {
            "filename": "/res/toolbar_addbrush.png",
            "start": 1383925,
            "end": 1387484
        }, {
            "filename": "/res/toolbar_erasebrush.png",
            "start": 1387484,
            "end": 1390958
        }, {
            "filename": "/res/toolbar_movelayer.png",
            "start": 1390958,
            "end": 1394060
        }, {
            "filename": "/res/toolbar_zoom.png",
            "start": 1394060,
            "end": 1395430
        }, {
            "filename": "/res/toolbariconbrush.png",
            "start": 1395430,
            "end": 1398930
        }, {
            "filename": "/res/toolbariconcamera.png",
            "start": 1398930,
            "end": 1400335
        }, {
            "filename": "/res/toolbariconeffects.png",
            "start": 1400335,
            "end": 1402614
        }, {
            "filename": "/res/toolbaricongallery.png",
            "start": 1402614,
            "end": 1403600
        }, {
            "filename": "/res/toolbariconimmenu.png",
            "start": 1403600,
            "end": 1406971
        }, {
            "filename": "/res/toolbariconlayers.png",
            "start": 1406971,
            "end": 1410069
        }, {
            "filename": "/res/toolbariconquestionmark.png",
            "start": 1410069,
            "end": 1413208
        }, {
            "filename": "/res/toolbariconredo.png",
            "start": 1413208,
            "end": 1416406
        }, {
            "filename": "/res/toolbariconundo.png",
            "start": 1416406,
            "end": 1416908
        }, {
            "filename": "/res/trackgroup.png",
            "start": 1416908,
            "end": 1419372
        }, {
            "filename": "/res/tradewindsregular-f.png",
            "start": 1419372,
            "end": 1422746
        }, {
            "filename": "/res/transiconin2.png",
            "start": 1422746,
            "end": 1427426
        }, {
            "filename": "/res/transiconout2.png",
            "start": 1427426,
            "end": 1432100
        }, {
            "filename": "/res/transitiona.png",
            "start": 1432100,
            "end": 1433845
        }, {
            "filename": "/res/transitionb.png",
            "start": 1433845,
            "end": 1435421
        }, {
            "filename": "/res/turkiest.lut",
            "start": 1435421,
            "end": 1459997
        }, {
            "filename": "/res/tutorial1.png",
            "start": 1459997,
            "end": 1464557
        }, {
            "filename": "/res/tutorial2.png",
            "start": 1464557,
            "end": 1468387
        }, {
            "filename": "/res/tutorialcoverfaceblur.jpg",
            "start": 1468387,
            "end": 1495520
        }, {
            "filename": "/res/tutorialcoverkeyframes.jpg",
            "start": 1495520,
            "end": 1515278
        }, {
            "filename": "/res/uploadbox.png",
            "start": 1515278,
            "end": 1515954
        }, {
            "filename": "/res/watermark_160.png",
            "start": 1515954,
            "end": 1527448
        }, {
            "filename": "/res/yatraoneregular-f.png",
            "start": 1527448,
            "end": 1529911
        }, {
            "filename": "/res/yellowtailregular-f.png",
            "start": 1529911,
            "end": 1533044
        }],
        "remote_package_size": 1533044
    })
})();
if (Module["ENVIRONMENT_IS_PTHREAD"] || Module["$ww"]) Module["preRun"] = [];
var necessaryPreJSTasks = Module["preRun"].slice();
if (!Module["preRun"]) throw "Module.preRun should exist because file support used it; did a pre-js delete it?";
necessaryPreJSTasks.forEach(function(task) {
    if (Module["preRun"].indexOf(task) < 0) throw "All preRun tasks that exist before user pre-js code should remain after; did you replace Module or modify Module.preRun?"
});
var moduleOverrides = Object.assign({}, Module);
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = (status, toThrow) => {
    throw toThrow
};
var ENVIRONMENT_IS_WEB = typeof window == "object";
var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (Module["ENVIRONMENT"]) {
    throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)")
}
var scriptDirectory = "";

function locateFile(path) {
    if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
    }
    return scriptDirectory + path
}
var read_, readAsync, readBinary, setWindowTitle;
if (ENVIRONMENT_IS_NODE) {
    if (typeof process == "undefined" || !process.release || process.release.name !== "node") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
    var nodeVersion = process.versions.node;
    var numericVersion = nodeVersion.split(".").slice(0, 3);
    numericVersion = numericVersion[0] * 1e4 + numericVersion[1] * 100 + numericVersion[2].split("-")[0] * 1;
    if (numericVersion < 101900) {
        throw new Error("This emscripten-generated code requires node v10.19.19.0 (detected v" + nodeVersion + ")")
    }
    var fs = require("fs");
    var nodePath = require("path");
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = nodePath.dirname(scriptDirectory) + "/"
    } else {
        scriptDirectory = __dirname + "/"
    }
    read_ = (filename, binary) => {
        filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
        return fs.readFileSync(filename, binary ? undefined : "utf8")
    };
    readBinary = filename => {
        var ret = read_(filename, true);
        if (!ret.buffer) {
            ret = new Uint8Array(ret)
        }
        assert(ret.buffer);
        return ret
    };
    readAsync = (filename, onload, onerror, binary = true) => {
        filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
        fs.readFile(filename, binary ? undefined : "utf8", (err, data) => {
            if (err) onerror(err);
            else onload(binary ? data.buffer : data)
        })
    };
    if (!Module["thisProgram"] && process.argv.length > 1) {
        thisProgram = process.argv[1].replace(/\\/g, "/")
    }
    arguments_ = process.argv.slice(2);
    if (typeof module != "undefined") {
        module["exports"] = Module
    }
    process.on("uncaughtException", ex => {
        if (ex !== "unwind" && !(ex instanceof ExitStatus) && !(ex.context instanceof ExitStatus)) {
            throw ex
        }
    });
    var nodeMajor = process.versions.node.split(".")[0];
    if (nodeMajor < 15) {
        process.on("unhandledRejection", reason => {
            throw reason
        })
    }
    quit_ = (status, toThrow) => {
        process.exitCode = status;
        throw toThrow
    };
    Module["inspect"] = () => "[Emscripten Module object]"
} else if (ENVIRONMENT_IS_SHELL) {
    if (typeof process == "object" && typeof require === "function" || typeof window == "object" || typeof importScripts == "function") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
    if (typeof read != "undefined") {
        read_ = f => {
            return read(f)
        }
    }
    readBinary = f => {
        let data;
        if (typeof readbuffer == "function") {
            return new Uint8Array(readbuffer(f))
        }
        data = read(f, "binary");
        assert(typeof data == "object");
        return data
    };
    readAsync = (f, onload, onerror) => {
        setTimeout(() => onload(readBinary(f)), 0)
    };
    if (typeof clearTimeout == "undefined") {
        globalThis.clearTimeout = id => {}
    }
    if (typeof scriptArgs != "undefined") {
        arguments_ = scriptArgs
    } else if (typeof arguments != "undefined") {
        arguments_ = arguments
    }
    if (typeof quit == "function") {
        quit_ = (status, toThrow) => {
            setTimeout(() => {
                if (!(toThrow instanceof ExitStatus)) {
                    let toLog = toThrow;
                    if (toThrow && typeof toThrow == "object" && toThrow.stack) {
                        toLog = [toThrow, toThrow.stack]
                    }
                    err("exiting due to exception: " + toLog)
                }
                quit(status)
            });
            throw toThrow
        }
    }
    if (typeof print != "undefined") {
        if (typeof console == "undefined") console = {};
        console.log = print;
        console.warn = console.error = typeof printErr != "undefined" ? printErr : print
    }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href
    } else if (typeof document != "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src
    }
    if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1)
    } else {
        scriptDirectory = ""
    }
    if (!(typeof window == "object" || typeof importScripts == "function")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
    {
        read_ = url => {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText
        };
        if (ENVIRONMENT_IS_WORKER) {
            readBinary = url => {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response)
            }
        }
        readAsync = (url, onload, onerror) => {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                    onload(xhr.response);
                    return
                }
                onerror()
            };
            xhr.onerror = onerror;
            xhr.send(null)
        }
    }
    setWindowTitle = title => document.title = title
} else {
    throw new Error("environment detection error")
}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
Object.assign(Module, moduleOverrides);
moduleOverrides = null;
checkIncomingModuleAPI();
if (Module["arguments"]) arguments_ = Module["arguments"];
legacyModuleProp("arguments", "arguments_");
if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
legacyModuleProp("thisProgram", "thisProgram");
if (Module["quit"]) quit_ = Module["quit"];
legacyModuleProp("quit", "quit_");
assert(typeof Module["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
assert(typeof Module["read"] == "undefined", "Module.read option was removed (modify read_ in JS)");
assert(typeof Module["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
assert(typeof Module["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
assert(typeof Module["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify setWindowTitle in JS)");
assert(typeof Module["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
legacyModuleProp("read", "read_");
legacyModuleProp("readAsync", "readAsync");
legacyModuleProp("readBinary", "readBinary");
legacyModuleProp("setWindowTitle", "setWindowTitle");
var IDBFS = "IDBFS is no longer included by default; build with -lidbfs.js";
assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable.");
var wasmBinary;
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
legacyModuleProp("wasmBinary", "wasmBinary");
var noExitRuntime = Module["noExitRuntime"] || true;
legacyModuleProp("noExitRuntime", "noExitRuntime");
if (typeof WebAssembly != "object") {
    abort("no native wasm support detected")
}
var wasmMemory;
var ABORT = false;
var EXITSTATUS;

function assert(condition, text) {
    if (!condition) {
        abort("Assertion failed" + (text ? ": " + text : ""))
    }
}
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateMemoryViews() {
    var b = wasmMemory.buffer;
    Module["HEAP8"] = HEAP8 = new Int8Array(b);
    Module["HEAP16"] = HEAP16 = new Int16Array(b);
    Module["HEAP32"] = HEAP32 = new Int32Array(b);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(b)
}
assert(!Module["STACK_SIZE"], "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
assert(typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined, "JS engine does not provide full typed array support");
assert(!Module["wasmMemory"], "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
assert(!Module["INITIAL_MEMORY"], "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
var wasmTable;

function writeStackCookie() {
    var max = _emscripten_stack_get_end();
    assert((max & 3) == 0);
    if (max == 0) {
        max += 4
    }
    HEAPU32[max >>> 2] = 34821223;
    HEAPU32[max + 4 >>> 2] = 2310721022;
    HEAPU32[0 >>> 0] = 1668509029
}

function checkStackCookie() {
    if (ABORT) return;
    var max = _emscripten_stack_get_end();
    if (max == 0) {
        max += 4
    }
    var cookie1 = HEAPU32[max >>> 2];
    var cookie2 = HEAPU32[max + 4 >>> 2];
    if (cookie1 != 34821223 || cookie2 != 2310721022) {
        abort("Stack overflow! Stack cookie has been overwritten at " + ptrToString(max) + ", expected hex dwords 0x89BACDFE and 0x2135467, but received " + ptrToString(cookie2) + " " + ptrToString(cookie1))
    }
    if (HEAPU32[0 >>> 0] !== 1668509029) {
        abort("Runtime error: The application has corrupted its heap memory area (address zero)!")
    }
}(function() {
    var h16 = new Int16Array(1);
    var h8 = new Int8Array(h16.buffer);
    h16[0] = 25459;
    if (h8[0] !== 115 || h8[1] !== 99) throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)"
})();
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeKeepaliveCounter = 0;

function keepRuntimeAlive() {
    return noExitRuntime || runtimeKeepaliveCounter > 0
}

function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPRERUN__)
}

function initRuntime() {
    assert(!runtimeInitialized);
    runtimeInitialized = true;
    checkStackCookie();
    if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
    FS.ignorePermissions = false;
    TTY.init();
    callRuntimeCallbacks(__ATINIT__)
}

function preMain() {
    checkStackCookie();
    callRuntimeCallbacks(__ATMAIN__)
}

function postRun() {
    checkStackCookie();
    if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
}

function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb)
}

function addOnInit(cb) {
    __ATINIT__.unshift(cb)
}

function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb)
}
assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
    var orig = id;
    while (1) {
        if (!runDependencyTracking[id]) return id;
        id = orig + Math.random()
    }
}

function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (id) {
        assert(!runDependencyTracking[id]);
        runDependencyTracking[id] = 1;
        if (runDependencyWatcher === null && typeof setInterval != "undefined") {
            runDependencyWatcher = setInterval(() => {
                if (ABORT) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                    return
                }
                var shown = false;
                for (var dep in runDependencyTracking) {
                    if (!shown) {
                        shown = true;
                        err("still waiting on run dependencies:")
                    }
                    err("dependency: " + dep)
                }
                if (shown) {
                    err("(end of list)")
                }
            }, 1e4)
        }
    } else {
        err("warning: run dependency added without ID")
    }
}

function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (id) {
        assert(runDependencyTracking[id]);
        delete runDependencyTracking[id]
    } else {
        err("warning: run dependency removed without ID")
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
        }
    }
}

function abort(what) {
    if (Module["onAbort"]) {
        Module["onAbort"](what)
    }
    what = "Aborted(" + what + ")";
    err(what);
    ABORT = true;
    EXITSTATUS = 1;
    if (what.indexOf("RuntimeError: unreachable") >= 0) {
        what += '. "unreachable" may be due to ASYNCIFY_STACK_SIZE not being large enough (try increasing it)'
    }
    var e = new WebAssembly.RuntimeError(what);
    throw e
}
var dataURIPrefix = "data:application/octet-stream;base64,";

function isDataURI(filename) {
    return filename.startsWith(dataURIPrefix)
}

function isFileURI(filename) {
    return filename.startsWith("file://")
}

function createExportWrapper(name, fixedasm) {
    return function() {
        var displayName = name;
        var asm = fixedasm;
        if (!fixedasm) {
            asm = Module["asm"]
        }
        assert(runtimeInitialized, "native function `" + displayName + "` called before runtime initialization");
        if (!asm[name]) {
            assert(asm[name], "exported native function `" + displayName + "` not found")
        }
        return asm[name].apply(null, arguments)
    }
}
var wasmBinaryFile;
wasmBinaryFile = "index-nosab-5010e84dde7a.wasm";
if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile)
}

function getBinary(file) {
    try {
        if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary)
        }
        if (readBinary) {
            return readBinary(file)
        }
        throw "both async and sync fetching of the wasm failed"
    } catch (err) {
        abort(err)
    }
}

function getBinaryPromise(binaryFile) {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == "function") {
            return fetch(binaryFile, {
                credentials: "same-origin"
            }).then(response => {
                console.log(response);
                if (!response["ok"]) {
                    throw "failed to load wasm binary file at '" + binaryFile + "'"
                }
                return response["arrayBuffer"]()
            }).catch(() => getBinary(binaryFile))
        } else {
            if (readAsync) {
                return new Promise((resolve, reject) => {
                    readAsync(binaryFile, response => resolve(new Uint8Array(response)), reject)
                })
            }
        }
    }
    return Promise.resolve().then(() => getBinary(binaryFile))
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
    console.log("uwu?",binaryFile)
    return getBinaryPromise(binaryFile).then(binary => {
        return WebAssembly.instantiate(binary, imports)
    }).then(instance => {
        return instance
    }).then(receiver, reason => {
        err("failed to asynchronously prepare wasm: " + reason);
        if (isFileURI(wasmBinaryFile)) {
            err("warning: Loading from a file URI (" + wasmBinaryFile + ") is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing")
        }
        abort(reason)
    })
}

function instantiateAsync(binary, binaryFile, imports, callback) {
    if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
        return fetch(binaryFile, {
        //    credentials: "same-origin"
        }).then(response => {
            console.log(response);
            var result = WebAssembly.instantiateStreaming(response, imports);
            return result.then(callback, function(reason) {
                err("wasm streaming compile failed: " + reason);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(binaryFile, imports, callback)
            })
        })
    } else {
        //alert(binaryFile);
        return instantiateArrayBuffer(binaryFile, imports, callback)
    }
}

function createWasm() {
    var info = {
        "env": wasmImports,
        "wasi_snapshot_preview1": wasmImports
    };

    function receiveInstance(instance, module) {
        var exports = instance.exports;
        exports = Asyncify.instrumentWasmExports(exports);
        Module["asm"] = exports;
        wasmMemory = Module["asm"]["memory"];
        assert(wasmMemory, "memory not found in wasm exports");
        updateMemoryViews();
        wasmTable = Module["asm"]["__indirect_function_table"];
        assert(wasmTable, "table not found in wasm exports");
        addOnInit(Module["asm"]["__wasm_call_ctors"]);
        removeRunDependency("wasm-instantiate");
        return exports
    }
    addRunDependency("wasm-instantiate");
    var trueModule = Module;

    function receiveInstantiationResult(result) {
        assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
        trueModule = null;
        receiveInstance(result["instance"])
    }
    if (Module["instantiateWasm"]) {
        try {
            return Module["instantiateWasm"](info, receiveInstance)
        } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false
        }
    }

   /// console.log(OZIPS[wasmBinaryFile.replace(thinger,"")]);
   console.log("https://cdn.jsdelivr.net/gh/jackb0back/streamingAssets@main/Vidmix/" + wasmBinaryFile.replace(thinger,""));
    instantiateAsync(wasmBinary, "https://cdn.jsdelivr.net/gh/jackb0back/streamingAssets@main/Vidmix/" + wasmBinaryFile.replace(thinger,""), info, receiveInstantiationResult);
    return {}
}
var tempDouble;
var tempI64;

function legacyModuleProp(prop, newName) {
    if (!Object.getOwnPropertyDescriptor(Module, prop)) {
        Object.defineProperty(Module, prop, {
            configurable: true,
            get: function() {
                abort("Module." + prop + " has been replaced with plain " + newName + " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")
            }
        })
    }
}

function ignoredModuleProp(prop) {
    if (Object.getOwnPropertyDescriptor(Module, prop)) {
        abort("`Module." + prop + "` was supplied but `" + prop + "` not included in INCOMING_MODULE_JS_API")
    }
}

function isExportedByForceFilesystem(name) {
    return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" || name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency"
}

function missingGlobal(sym, msg) {
    if (typeof globalThis !== "undefined") {
        Object.defineProperty(globalThis, sym, {
            configurable: true,
            get: function() {
                warnOnce("`" + sym + "` is not longer defined by emscripten. " + msg);
                return undefined
            }
        })
    }
}
missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");

function missingLibrarySymbol(sym) {
    if (typeof globalThis !== "undefined" && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
        Object.defineProperty(globalThis, sym, {
            configurable: true,
            get: function() {
                var msg = "`" + sym + "` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line";
                var librarySymbol = sym;
                if (!librarySymbol.startsWith("_")) {
                    librarySymbol = "$" + sym
                }
                msg += " (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE=" + librarySymbol + ")";
                if (isExportedByForceFilesystem(sym)) {
                    msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"
                }
                warnOnce(msg);
                return undefined
            }
        })
    }
    unexportedRuntimeSymbol(sym)
}

function unexportedRuntimeSymbol(sym) {
    if (!Object.getOwnPropertyDescriptor(Module, sym)) {
        Object.defineProperty(Module, sym, {
            configurable: true,
            get: function() {
                var msg = "'" + sym + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)";
                if (isExportedByForceFilesystem(sym)) {
                    msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"
                }
                abort(msg)
            }
        })
    }
}
var ASM_CONSTS = {
    783309: () => {
        var inp = document.getElementById("dummyinput");
        var canv = document.getElementById("canvas");
        Module.textCursor = false;
        var cursorX;
        var cursorY;
        inp.addEventListener("mousedown", function(event) {
            const crect = canv.getBoundingClientRect();
            if (event.button == 0) {
                _jsMouseDown(event.clientX - crect.left, event.clientY - crect.top, event.shiftKey ? 1 : 0);
                event.stopPropagation();
                event.preventDefault()
            }
        });
        inp.addEventListener("mouseup", function(event) {
            const crect = canv.getBoundingClientRect();
            _jsMouseUp(event.clientX - crect.left, event.clientY - crect.top)
        });
        inp.addEventListener("input", function(event) {
            var str_ptr = allocate(intArrayFromString(inp.value), ALLOC_NORMAL);
            _jsInput(str_ptr, event.isComposing ? 1 : 0);
            _free(str_ptr);
            inp.value = ""
        });
        inp.addEventListener("mousemove", function(event) {
            const rect = canv.getBoundingClientRect();
            cursorX = event.clientX - rect.left;
            cursorY = event.clientY - rect.top;
            inp.style.left = cursorX - 10 + "px";
            inp.style.top = cursorY - 10 + "px";
            const crect = canv.getBoundingClientRect();
            _jsMouseMove(event.clientX - crect.left, event.clientY - crect.top)
        });
        inp.addEventListener("wheel", event => {
            if (event.ctrlKey) {
                _jsWheelEvent(cursorX, cursorY, 0, 0, event.deltaY, event.deltaMode, 0)
            } else {
                _jsWheelEvent(cursorX, cursorY, event.deltaX, event.deltaY, event.deltaZ, event.deltaMode, 0)
            }
            event.stopPropagation();
            event.preventDefault();
            return false
        }, {
            passive: false
        });
        canv.addEventListener("mousedown", function(event) {
            const rect = canv.getBoundingClientRect();
            cursorX = event.clientX - rect.left;
            cursorY = event.clientY - rect.top;
            _jsMouseDown(cursorX, cursorY, event.shiftKey ? 1 : 0, event.button)
        });
        canv.addEventListener("mouseup", function(event) {
            const rect = canv.getBoundingClientRect();
            cursorX = event.clientX - rect.left;
            cursorY = event.clientY - rect.top;
            _jsMouseUp(cursorX, cursorY)
        });
        canv.addEventListener("mousemove", function(event) {
            const rect = canv.getBoundingClientRect();
            cursorX = event.clientX - rect.left;
            cursorY = event.clientY - rect.top;
            if (Module.textCursor) {
                inp.style.left = event.clientX - 10 + "px";
                inp.style.top = event.clientY - 10 + "px"
            }
            _jsMouseMove(cursorX, cursorY)
        });
        document.addEventListener("mouseleave", function(event) {
            _jsMouseLeave()
        });
        document.addEventListener("touchstart", function(event) {
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                _jsTouchStart(touches[i].pageX, touches[i].pageY, touches[i].identifier)
            }
        }, {
            passive: true
        });
        document.addEventListener("touchmove", function(event) {
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                _jsTouchMove(touches[i].pageX, touches[i].pageY, touches[i].identifier)
            }
            if (Module.textCursor) {
                inp.style.left = event.clientX - 10 + "px";
                inp.style.top = event.clientY - 10 + "px"
            }
        }, {
            passive: true
        });
        document.addEventListener("touchend", function(event) {
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                _jsTouchEnd(touches[i].pageX, touches[i].pageY, touches[i].identifier)
            }
        }, {
            passive: true
        });
        document.addEventListener("touchcancel", function(event) {
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                _jsTouchCancel(touches[i].pageX, touches[i].pageY, touches[i].identifier)
            }
        }, {
            passive: true
        });
        document.addEventListener("keypress", function(event) {
            _jsKeyPress(event.keyCode, event.shiftKey ? 1 : 0, event.ctrlKey ? 1 : 0, event.altKey ? 1 : 0);
            event.preventDefault()
        });
        document.addEventListener("keydown", function(event) {
            _jsKeyDown(event.keyCode, event.shiftKey ? 1 : 0, event.ctrlKey ? 1 : 0, event.altKey ? 1 : 0)
        });
        document.addEventListener("paste", function(event) {
            let cbtext = event.clipboardData.getData("text");
            if (cbtext) {
                var str_ptr = allocate(intArrayFromString(cbtext), ALLOC_NORMAL);
                _jsInput(str_ptr, 2);
                _free(str_ptr)
            }
        });
        document.addEventListener("copy", function(event) {
            _getTextToCopy();
            console.log("tocopy : " + window.texttocopy);
            if (window.texttocopy) {
                event.clipboardData.setData("text/plain", window.texttocopy)
            }
            event.preventDefault()
        });
        document.addEventListener("wheel", event => {
            var isWheel = event.wheelDeltaY != 0 && (event.wheelDeltaY == 120 || event.wheelDeltaY == -120 || event.wheelDeltaY % 120 == 0);
            if (event.ctrlKey) {
                _jsWheelEvent(cursorX, cursorY, 0, 0, event.deltaY, event.deltaMode, isWheel)
            } else {
                var dy = event.deltaY;
                if ("wheelDeltaY" in event) {
                    if (event.wheelDeltaY == 120 || event.wheelDeltaY == -120 || event.wheelDeltaY % 120 == 0) {
                        dy = -event.wheelDeltaY / 5
                    }
                }
                _jsWheelEvent(cursorX, cursorY, event.deltaX, dy, event.deltaZ, event.deltaMode, isWheel)
            }
            event.stopPropagation();
            event.preventDefault();
            return false
        }, {
            passive: false
        });
        document.addEventListener("dragover", function(event) {
            event.preventDefault()
        }, false);
        document.addEventListener("drop", function(event) {
            event.preventDefault();
            console.log("drop: " + event);
            if (event.dataTransfer.items) {
                for (var i = 0; i < event.dataTransfer.items.length; i++) {
                    if (event.dataTransfer.items[i].kind === "file") {
                        var file = event.dataTransfer.items[i].getAsFile();
                        receiveOpenedFile(file)
                    }
                }
            } else {}
        }, false);
        window.addEventListener("resize", function(event) {
            canv.style.width = window.innerWidth + "px";
            canv.style.height = window.innerHeight + "px";
            var devicePixelRatio = window.devicePixelRatio || 1;
            canv.width = window.innerWidth * devicePixelRatio;
            canv.height = window.innerHeight * devicePixelRatio;
            _jsWindowResized()
        }, {
            passive: false
        });
        setTimeout(function() {
            canv.style.width = window.innerWidth + "px";
            canv.style.height = window.innerHeight + "px";
            var devicePixelRatio = window.devicePixelRatio || 1;
            canv.width = window.innerWidth * devicePixelRatio;
            canv.height = window.innerHeight * devicePixelRatio;
            _jsWindowResized()
        }, 500)
    },
    789186: () => {
        window.beaconURL = "https://wvm.voxeloid.com/log/"
    },
    789242: () => {
        return typeof InstallTrigger !== "undefined" ? 1 : 0
    },
    789302: ($0, $1) => {
        window.parent.postMessage({
            "vidmix-request-answer": $1,
            "answer": {
                "layer": UTF8ToString($0)
            }
        })
    },
    789401: ($0, $1) => {
        window.parent.postMessage({
            "vidmix-request-answer": $1,
            "answer": {
                "layer": JSON.parse(UTF8ToString($0))
            }
        })
    },
    789512: ($0, $1) => {
        window.parent.postMessage({
            "vidmix-request-answer": $1,
            "answer": {
                "layers": JSON.parse(UTF8ToString($0))
            }
        })
    },
    789624: ($0, $1) => {
        window.parent.postMessage({
            "vidmix-event": {
                "name": UTF8ToString($0),
                "embedid": UTF8ToString($1)
            }
        })
    },
    789730: ($0, $1, $2) => {
        window.parent.postMessage({
            "vidmix-event": {
                "name": UTF8ToString($0),
                "embedid": UTF8ToString($1),
                "file": FS.readFile(UTF8ToString($2))
            }
        })
    },
    789875: () => {
        window.loadGDriveScript1 = function() {
            return new Promise(resolve => {
                if (typeof window.gapi_js === "undefined") {
                    window.gapi_js = document.createElement("script");
                    window.gapi_js.type = "text/javascript";
                    window.gapi_js.src = "https://apis.google.com/js/api.js";
                    window.gapi_js.onload = function() {
                        window.gapi.load("client:picker", async () => {
                            await gapi.client.load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest");
                            resolve(true)
                        })
                    };
                    document.getElementsByTagName("head")[0].appendChild(window.gapi_js)
                } else {
                    resolve(true)
                }
            })
        };
        window.loadGDriveScript2 = function() {
            return new Promise(resolve => {
                if (typeof window.gapi_js2 === "undefined") {
                    window.gapi_js2 = document.createElement("script");
                    window.gapi_js2.type = "text/javascript";
                    window.gapi_js2.src = "https://accounts.google.com/gsi/client";
                    window.gapi_js2.onload = function() {
                        resolve(true)
                    };
                    document.getElementsByTagName("head")[0].appendChild(window.gapi_js2)
                } else {
                    resolve(true)
                }
            })
        };
        window.authenticateWithGoogle = async function() {
            return new Promise(async resolve => {
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: "284217611942-v4bk0bv4s3l39eqfm5ep5fkbs18hc9pe.apps.googleusercontent.com",
                    scope: "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install",
                    callback: async response => {
                        if (response.error !== undefined) {
                            throw response
                        }
                        document.cookie = "googledriveaccesstoken=" + response.access_token;
                        resolve(response.access_token)
                    }
                });
                tokenClient.requestAccessToken()
            })
        };
        window.getGoogleDriveAccessToken = async function() {
            return new Promise(async resolve => {
                var match = document.cookie.match(new RegExp("(^| )" + "googledriveaccesstoken" + "=([^;]+)"));
                if (match) {
                    let checkurl = "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + match[2];
                    var xhr = new XMLHttpRequest;
                    xhr.open("get", checkurl, true);
                    xhr.responseType = "json";
                    xhr.onload = async function() {
                        var status = xhr.status;
                        if (status == 200) {
                            if ("error" in xhr.response) {
                                let newtoken = await window.authenticateWithGoogle();
                                resolve(newtoken)
                            } else {
                                resolve(match[2])
                            }
                        } else {
                            let newtoken = await window.authenticateWithGoogle();
                            resolve(newtoken)
                        }
                    };
                    xhr.send();
                    return
                }
                let newtoken = await window.authenticateWithGoogle();
                resolve(newtoken)
            })
        };
        window.downloadGoogleDriveFile = function(fileid, docfilename) {
            let url = "https://www.googleapis.com/drive/v3/files/" + fileid + "?alt=media";
            var xhr = new XMLHttpRequest;
            xhr.open("get", url, true);
            xhr.setRequestHeader("authorization", "Bearer " + window.gdrive_accessToken);
            xhr.responseType = "arraybuffer";
            xhr.onload = function() {
                var status = xhr.status;
                if (status == 200) {
                    var filename_ptr = window.Module.allocate(window.Module.intArrayFromString(docfilename), window.Module.ALLOC_NORMAL);
                    var u8res = new Uint8Array(xhr.response);
                    var ptr = window.Module.allocate(u8res, window.Module.ALLOC_NORMAL);
                    _gdriveFileOpenCallback(ptr, xhr.response.byteLength, filename_ptr);
                    window.Module._free(ptr)
                } else {
                    reject(status)
                }
            };
            xhr.send()
        };
        window.getGoogleDriveFileInfo = function(fileid) {
            return new Promise(async resolve => {
                let url = "https://www.googleapis.com/drive/v3/files/" + fileid + "?key=284217611942-v4bk0bv4s3l39eqfm5ep5fkbs18hc9pe.apps.googleusercontent.com";
                var xhr = new XMLHttpRequest;
                xhr.open("get", url, true);
                xhr.setRequestHeader("authorization", "Bearer " + window.gdrive_accessToken);
                xhr.responseType = "json";
                xhr.onload = function() {
                    var status = xhr.status;
                    if (status == 200) {
                        resolve(xhr.response)
                    } else {
                        reject(status)
                    }
                };
                xhr.onerror = function() {
                    reject(status)
                };
                xhr.send()
            })
        }
    },
    793624: () => {
        async function pickerCallback(data) {
            if (data.action === google.picker.Action.PICKED) {
                let text = "Picker response: \n" + JSON.stringify(data, null, 2) + "\n";
                const document = data[google.picker.Response.DOCUMENTS][0];
                const fileId = document[google.picker.Document.ID];
                const res = await getGoogleDriveFileInfo(fileId);
                text += "Drive API response for first document: \n" + JSON.stringify(res, null, 2) + "\n";
                var docfilename = res.name;
                window.downloadGoogleDriveFile(fileId, docfilename)
            }
        }
        async function openWithGDrive() {
            await Promise.all([window.loadGDriveScript1(), window.loadGDriveScript2()]);
            window.gdrive_accessToken = await window.getGoogleDriveAccessToken();
            const view = new google.picker.View(google.picker.ViewId.DOCS);
            view.setMimeTypes("image/png,image/jpeg,image/jpg");
            const API_KEY = "AIzaSyBjBVNQLy3UNoe6OxQ3o6B7UBlVhwjP-3k";
            const APP_ID = "284217611942";
            const picker = (new google.picker.PickerBuilder).enableFeature(google.picker.Feature.NAV_HIDDEN).enableFeature(google.picker.Feature.MULTISELECT_ENABLED).setDeveloperKey(API_KEY).setAppId(APP_ID).setOAuthToken(window.gdrive_accessToken).addView(view).addView(new google.picker.DocsUploadView).setCallback(pickerCallback).build();
            picker.setVisible(true)
        }
        openWithGDrive()
    },
    794894: () => {
        var url = new URL(window.location);
        var c = url.searchParams.get("state");
        if (c) {
            (async () => {
                await Promise.all([window.loadGDriveScript1(), window.loadGDriveScript2()]);
                window.gdrive_accessToken = await window.getGoogleDriveAccessToken();
                let stateData = JSON.parse(c);
                let fileId = stateData["ids"][0];
                let fileinfo = await window.getGoogleDriveFileInfo(fileId);
                await window.downloadGoogleDriveFile(fileId, fileinfo["name"])
            })()
        }
    },
    795341: () => {
        return jsChromeVersion()
    },
    795371: ($0, $1) => {
        window.parent.postMessage({
            "vidmix-request-answer": $1,
            "answer": {
                "layerid": UTF8ToString($0)
            }
        })
    },
    795472: ($0, $1) => {
        window.parent.postMessage({
            "vidmix-request-answer": $1,
            "answer": {
                "layer": JSON.parse(UTF8ToString($0))
            }
        })
    },
    795583: () => {
        if (navigator.userAgent.toLowerCase().indexOf("android") > -1) return -1;
        if ("VideoDecoder" in window) return 1;
        return -1
    },
    795712: () => {
        if (navigator.userAgent.toLowerCase().indexOf("android") > -1) return -1;
        if ("AudioDecoder" in window) return 1;
        return -1
    },
    795841: () => {
        return navigator.vendor && navigator.vendor.indexOf("Apple") > -1
    },
    795914: $0 => {
        var fname = UTF8ToString($0);
        try {
            var filename_str_ptr = FFmpegModule.allocate(FFmpegModule.intArrayFromString(fname), FFmpegModule.ALLOC_NORMAL);
            var res = FFmpegModule._fileHasVideo(filename_str_ptr);
            FFmpegModule._free(filename_str_ptr)
        } catch (ex) {
            return -1
        }
        return res
    },
    796201: () => {
        FFworker.addEventListener("message", function(event) {
            if (event.data.cmd == "filereadreq") {
                (async () => {
                    let offs = event.data.args.offset_h * 268435456 + event.data.args.offset_l;
                    if (event.data.args.fileHandleID in window.openFiles) {
                        const slicebuff = await window.openFiles[event.data.args.fileHandleID].slice(offs, offs + event.data.args.readlength).arrayBuffer();
                        const slicearr = new Uint8Array(slicebuff);
                        FFworker.postMessage({
                            "cmd": "filereadres",
                            "buff": slicearr,
                            "reqID": event.data.args.reqID
                        })
                    } else {
                        var buf = new Uint8Array(event.data.args.readlength);
                        FS.read(window.emfiles[event.data.args.fileHandleID], buf, 0, event.data.args.readlength, offs);
                        FFworker.postMessage({
                            "cmd": "filereadres",
                            "buff": buf,
                            "reqID": event.data.args.reqID
                        })
                    }
                })()
            }
            if (event.data.cmd == "openfile") {
                let ffbuff = event.data.res.buff;
                if (ffbuff.length > 0) {
                    var ptr = window.Module._malloc(ffbuff.length);
                    window.Module.HEAPU8.set(ffbuff, ptr);
                    _guVideoFFLoadFinished(ptr, ffbuff.length, event.data.res.ref)
                } else {
                    _guVideoFFLoadFinished(0, 0, event.data.res.ref)
                }
            }
            if (event.data.cmd == "openfile-progress") {
                if (typeof ffLoadFileProgressCallback === "function") {
                    ffLoadFileProgressCallback(event.data.args.progress, event.data.args.ref)
                }
            }
            if (event.data.cmd == "getFFAudioData") {
                if (event.data.res.buff.length == 0) {
                    _ffAudioReadResultCallback(event.data.res.vid, event.data.res.reqID, 0);
                    return
                }
                let rbuff = new Uint8Array(event.data.res.buff);
                var ptr = window.Module._malloc(rbuff.length);
                window.Module.HEAPU8.set(rbuff, ptr);
                _ffAudioReadResultCallback(event.data.res.vid, event.data.res.reqID, ptr)
            }
            if (event.data.cmd == "getFFVideoDecoderFrame") {
                let rbuff = new Uint8Array(event.data.res.buff);
                var ptr = window.Module._malloc(rbuff.length);
                window.Module.HEAPU8.set(rbuff, ptr);
                let w = event.data.res.width;
                let h = event.data.res.height;
                ffmpegDoneVideoFrameDecodeCallback(event.data.res.vid, event.data.res.reqID, event.data.res.ts, ptr, ptr, ptr + w * h, ptr + w * h + w * h / 4, w, h)
            }
            if (event.data.cmd == "seekVideoOutputFile") {
                window.seekVideoOutputFile(event.data.fhid, event.data.offset_h * 268435456 + event.data.offset_l)
            }
            if (event.data.cmd == "writeToVideoOutputFile") {
                window.writeToVideoOutputFile(event.data.fhid, event.data.buff)
            }
            if (event.data.cmd == "ffmpegDoneVideoFrameCallback") {
                ffmpegDoneVideoFrameCallback(event.data.args.rid)
            }
            if (event.data.cmd == "ffmpegDoneAudioFrameCallback") {
                ffmpegDoneAudioFrameCallback(event.data.args.rid)
            }
            if (event.data.cmd == "ffmpegOutputDownload") {
                window.ffmpegOutputDownload[event.data.args.rid](event.data.args.rid)
            }
        })
    },
    798844: () => {
        FFmpegModule._disableLogging()
    },
    798880: $0 => {
        FFmpegModule._closeFFVideoDecoder($0)
    },
    798923: $0 => {
        FFworker.postMessage({
            "cmd": "closeFFVideoDecoder",
            "args": {
                "vid": $0
            }
        })
    },
    799010: $0 => {
        FFmpegModule._closeFFVideoDecoder($0)
    },
    799053: $0 => {
        FFworker.postMessage({
            "cmd": "closeFFVideoDecoder",
            "args": {
                "vid": $0
            }
        })
    },
    799140: $0 => {
        console.log("decoder state after deoding error: " + decodersByPRId[$0].state);
        if (decodersByPRId[$0].state == "closed") {
            console.log("reinitializing decoder");
            return 1
        }
        return 0
    },
    799326: $0 => {
        return decodersByPRId[$0].decodeQueueSize
    },
    799373: () => {
        return navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && navigator.userAgent.indexOf("CriOS") == -1 && navigator.userAgent.indexOf("FxiOS") == -1 ? 1 : 0
    },
    799569: ($0, $1, $2) => {
        (async function(ts, tex, prdid) {
            var frame = decodedFrames[prdid][ts];
            const level = 0;
            const internalFormat = gl.RGBA;
            const srcFormat = gl.RGBA;
            const srcType = gl.UNSIGNED_BYTE;
            gl.bindTexture(gl.TEXTURE_2D, GL.textures[tex]);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, frame);
            decodedFrames[prdid][ts].close();
            delete decodedFrames[prdid][ts];
            _webCodecsFrameCopiedToGLTex(prdid, ts)
        })($0, $1, $2)
    },
    800005: ($0, $1) => {
        decodedFrames[$0][$1].close();
        delete decodedFrames[$0][$1]
    },
    800070: $0 => {
        decodersByPRId[$0].configure(decoderConfigsByPRId[$0])
    },
    800129: ($0, $1, $2) => {
        lastVideoID = lastVideoID + 1;
        var filename = UTF8ToString($0);
        var filename_str_ptr = FFmpegModule.allocate(FFmpegModule.intArrayFromString(filename), FFmpegModule.ALLOC_NORMAL);
        let ffinfobuff = new Uint8Array(window.Module.HEAPU8.buffer, $1, $2);
        var ffinfo_ptr = FFmpegModule._malloc($2);
        FFmpegModule.HEAPU8.set(ffinfobuff, ffinfo_ptr);
        FFmpegModule._startFFVideoDecoder(filename_str_ptr, lastVideoID, ffinfo_ptr);
        FFmpegModule._free(filename_str_ptr);
        return lastVideoID
    },
    800609: ($0, $1, $2) => {
        lastVideoID = lastVideoID + 1;
        let fibuff = new Uint8Array($2);
        fibuff.set(new Uint8Array(window.Module.HEAPU8.buffer, $1, $2), 0);
        FFworker.postMessage({
            "cmd": "startFFVideoDecoder",
            "args": {
                "filename": UTF8ToString($0),
                "infobuff": fibuff,
                "vid": lastVideoID
            }
        });
        return lastVideoID
    },
    800908: ($0, $1, $2, $3, $4, $5, $6) => {
        var extradata_shared = new Uint8Array(window.Module.HEAPU8.buffer, $4, $5);
        var extradata_ab = new ArrayBuffer(extradata_shared.byteLength);
        var extradata = new Uint8Array(extradata_ab);
        extradata.set(extradata_shared);
        var codecStrArray = new Uint8Array(window.Module.HEAPU8.buffer, $2, $3);
        var codecStr = "";
        for (let i = 0; i < $3; i++) {
            codecStr += String.fromCharCode(codecStrArray[i])
        }
        var cfg = {};
        cfg["codedHeight"] = $1;
        cfg["codedWidth"] = $0;
        cfg["codec"] = codecStr;
        if ($5 > 0) {
            cfg["description"] = extradata
        }
        try {
            VideoDecoder.isConfigSupported(cfg).then(support => {
                _supportCheckJSResult($6, support.supported ? 1 : 0)
            }).catch(error => {
                _supportCheckJSResult($6, 0)
            })
        } catch (e) {
            _supportCheckJSResult($6, 0)
        }
    },
    801661: () => {
        return jsChromeVersion()
    },
    801691: $0 => {
        return decodersByPRId[$0].decodeQueueSize
    },
    801738: $0 => {
        setTimeout(function() {
            _videoDecoderWatchdog($0)
        }, 10)
    },
    801800: $0 => {
        return decodersByPRId[$0].decodeQueueSize
    },
    801847: $0 => {
        if (typeof decodedFrames === "undefined") {
            decodedFrames = {}
        }
        if (!($0 in decodedFrames)) decodedFrames[$0] = {}
    },
    801969: ($0, $1, $2) => {
        decodersByPRId[$0].flush().then(() => {
            _webCodecsFlushPromiseResolved($2, $0, 0, $1)
        }).catch(e => {
            console.log("flush error: (s) " + e)
        })
    },
    802113: $0 => {
        setTimeout(function() {
            _videoDecoderWatchdog($0)
        }, 100)
    },
    802176: () => {
        return typeof document === "undefined" ? 1 : 0
    },
    802230: $0 => {
        window.videoputrequests[$0].abort();
        window.videoputrequests[$0] = {}
    },
    802305: $0 => {
        videoputrequests[$0] = {}
    },
    802336: ($0, $1, $2, $3) => {
        var url = UTF8ToString($0);
        var data = FS.readFile(UTF8ToString($1), {});
        var request = new XMLHttpRequest;
        request.upload.addEventListener("progress", function(e) {
            _videoputrequestprogress($2, e.loaded, e.total)
        });
        request.upload.addEventListener("error", function(e) {
            console.log("PUT request error");
            console.log(event);
            _videoputrequestprogress($2, -1, -1)
        });
        var method = UTF8ToString($3);
        request.open(method, url);
        request.timeout = 45e3;
        request.send(data);
        if ($2 == 0) {
            window.videoputrequests = {}
        }
        window.videoputrequests[$2] = request
    },
    802903: () => {
        window.ffSplitAudioDone = ref => {
            console.log("ffSplitAudioDone ", ref);
            _audioSplitDoneCallback()
        }
    },
    803012: ($0, $1, $2) => {
        let path = UTF8ToString($0);
        var ptr = FFmpegModule.allocate(FFmpegModule.intArrayFromString(path), FFmpegModule.ALLOC_NORMAL);
        var outfname_ptr = FFmpegModule.allocate(FFmpegModule.intArrayFromString(UTF8ToString($2)), FFmpegModule.ALLOC_NORMAL);
        FFmpegModule._splitAudio(-1, 0, 0, 0, 0, ptr, $1, outfname_ptr)
    },
    803329: ($0, $1, $2, $3, $4, $5, $6) => {
        var outfname_ptr = FFmpegModule.allocate(FFmpegModule.intArrayFromString(UTF8ToString($6)), FFmpegModule.ALLOC_NORMAL);
        FFmpegModule._splitAudio($0, $1, $2, $3, $4, 0, $5, outfname_ptr)
    },
    803520: $0 => {
        jsCreateWebcodecsAudioDecoder($0)
    },
    803559: $0 => {
        decodersByPRId[$0].flush().then(() => {
            decodersByPRId[$0].configure(audioDecoderConfigsByPRId[$0]);
            _jsAudioFlushDone($0)
        }).catch(e => {
            console.log("flush error (aw): " + e)
        })
    },
    803744: $0 => {
        decodersByPRId[$0].flush().then(() => {}).catch(e => {
            console.log("flush error (a): " + e)
        })
    },
    803844: () => {
        window.ffAudioDecoded = (vidid, reqid, buff, buffsize) => {
            if (buff == 0) {
                _ffAudioReadResultCallback(vidid, reqid, 0);
                return
            }
            let ffbuff = new Uint8Array(FFmpegModule.HEAPU8.buffer, buff, buffsize);
            var ptr = window.Module._malloc(buffsize);
            window.Module.HEAPU8.set(ffbuff, ptr);
            _ffAudioReadResultCallback(vidid, reqid, ptr);
            FFmpegModule._free(buff)
        }
    },
    804207: ($0, $1, $2, $3, $4) => {
        FFmpegModule._getFFAudioData($0, $1, $2, $3, $4)
    },
    804261: ($0, $1, $2, $3, $4) => {
        FFworker.postMessage({
            "cmd": "getFFAudioData",
            "args": {
                "vid": $0,
                "reqid": $1,
                "offs_l": $2,
                "offs_h": $3,
                "scnt": $4
            }
        })
    },
    804399: ($0, $1, $2, $3, $4) => {
        let jch0 = audioBuffers[UTF8ToString($0)][0];
        let jch1 = audioBuffers[UTF8ToString($0)][1];
        jch0 = jch0.slice($1, $1 + $2);
        jch1 = jch1.slice($1, $1 + $2);
        Module.HEAP16.set(jch0, $3 / 2);
        Module.HEAP16.set(jch1, $4 / 2)
    },
    804625: $0 => {
        return audioBuffers[UTF8ToString($0)][0].length
    },
    804678: ($0, $1, $2, $3, $4) => {
        let jch0 = audioBuffers[UTF8ToString($0)][0];
        let jch1 = audioBuffers[UTF8ToString($0)][1];
        jch0 = jch0.slice($1, $1 + $2);
        jch1 = jch1.slice($1, $1 + $2);
        Module.HEAP16.set(jch0, $3 / 2);
        Module.HEAP16.set(jch1, $4 / 2)
    },
    804904: ($0, $1, $2) => {
        if ($1 == 0) videos[$0].volume = $2;
        else videos[$0 + "-" + $1].volume = $2
    },
    804981: () => {},
    804985: () => {
        ffmpegDoneAudioFrameCallback = rendererID => {
            _ffmpegAudioSampleEncoded(rendererID)
        };
        ffmpegDoneVideoFrameCallback = rendererID => {
            _ffEncodeBufferConsumed(rendererID)
        }
    },
    805165: ($0, $1, $2, $3, $4, $5, $6) => {
        const audioCtx = new OfflineAudioContext(2, $1, $0);
        var inputData = new Int16Array(window.Module.HEAP16.buffer, $5, $3 * $2);
        var audioBuffer = audioCtx.createBuffer(2, inputData.length / $2, $4);
        var channelData0 = audioBuffer.getChannelData(0);
        var channelData1 = $2 >= 2 ? audioBuffer.getChannelData(1) : audioBuffer.getChannelData(0);
        for (var i = 0; i < inputData.length; i++) {
            channelData0[i] = inputData[i * 2] / 32767;
            channelData1[i] = inputData[i * 2 + 1] / 32767
        }
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.start(0);
        audioCtx.oncomplete = function(e) {
            var outputDataLen = e.renderedBuffer.getChannelData(0).length * 2;
            var outputPtr = window.Module._malloc(outputDataLen * 2);
            var outputDataView = new Int16Array(outputDataLen);
            var renderedChannelData0 = e.renderedBuffer.getChannelData(0);
            var renderedChannelData1 = e.renderedBuffer.getChannelData(1);
            for (var i = 0; i < renderedChannelData0.length; i++) {
                outputDataView[i * 2] = Math.floor(renderedChannelData0[i] * 32767);
                outputDataView[i * 2 + 1] = Math.floor(renderedChannelData1[i] * 32767)
            }
            Module.HEAP16.set(outputDataView, outputPtr / 2);
            window.Module._resampledAudioCallback(outputPtr, outputDataLen, $6, $0);
            window.Module._free(outputPtr)
        };
        audioCtx.startRendering()
    },
    806531: $0 => {
        return window.renderTargetFileSizes[$0]
    },
    806576: () => {
        if (FFmpegModule) {
            FFmpegModule._setReadyToReceiveProxyFrames(1)
        }
    },
    806649: () => {
        FFmpegModule._setReadyToReceiveProxyFrames(0);
        FFmpegModule._cancelProxyGen()
    },
    806732: ($0, $1, $2, $3, $4, $5) => {
        var filename = UTF8ToString($0);
        var filename_str_ptr = FFmpegModule.allocate(FFmpegModule.intArrayFromString(filename), FFmpegModule.ALLOC_NORMAL);
        let ffinfobuff = new Uint8Array(window.Module.HEAPU8.buffer, $4, $5);
        var ffinfo_ptr = FFmpegModule._malloc($5);
        FFmpegModule.HEAPU8.set(ffinfobuff, ffinfo_ptr);
        FFmpegModule._startProxyGen(filename_str_ptr, ffinfo_ptr, $3);
        FFmpegModule._free(filename_str_ptr);
        ffSeqFrameReadResult = function(buff, buffsize, buffWidth, buffHeight, rendererID, ts_ms, frameIx, islast, totalFrameCount) {
            _proxyFrameDecoded(rendererID, islast, totalFrameCount);
            if (buff == 0) {}(async () => {
                let fbuff = new Uint8ClampedArray(Module.HEAPU8.buffer, buff, buffsize);
                let frameImageData = new ImageData(fbuff.slice(0, buffsize), buffWidth, buffHeight);
                const bitmap = await createImageBitmap(frameImageData);
                let timestamp = ts_ms * 1e3;
                let frame = new VideoFrame(bitmap, {
                    timestamp: timestamp
                });
                const ret = proxyencoder.encode(frame, {
                    keyFrame: frameIx % 10 === 0
                });
                frame.close();
                _free(buff)
            })()
        }
    },
    807782: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) => {
        (async () => {
            var rendererID = $7;
            var targetFile = UTF8ToString($8);
            var fileHandleID = $9;
            var opts = {};
            opts.types = [];
            if ($3 == 3) {
                opts.types.push({
                    description: "Video file",
                    accept: {
                        "video/webm": [".webm"]
                    }
                })
            } else {
                opts.types.push({
                    description: "Video file",
                    accept: {
                        "video/mp4": [".mp4"]
                    }
                })
            }
            window.encoderInfo = {};
            window.encoderInfo[rendererID] = {};
            window.encoderInfo[rendererID].started = false;
            if (typeof window.ffmpegOutputDownload === "undefined") {
                window.ffmpegOutputDownload = {}
            }
            window.ffmpegOutputDownload[rendererID] = rendererID => {
                (async () => {
                    if (fileHandleID != -1) {
                        await window.renderTargetFiles[fileHandleID].close();
                        window.openFiles[fileHandleID] = await window.openFileHandles[fileHandleID].getFile();
                        console.log("opened file after writeclose: (" + fileHandleID + ")");
                        console.log(window.openFiles[fileHandleID])
                    }
                    _proxyGenFinished(rendererID)
                })()
            };

            function encoderOutputHandlerCreator(rendererID, targetPath) {
                return function(chunk, opts) {
                    if (chunk.data) {
                        var uarr = new Uint8Array(chunk.data)
                    } else {
                        var uarr = new Uint8Array(chunk.byteLength);
                        chunk.copyTo(uarr)
                    }
                    FFmpegModule._setReadyToReceiveProxyFrames(proxyencoder.encodeQueueSize < 10 && !_jsNeedsToPauseProxyGen() ? 1 : 0);
                    if (uarr.length > 0) {
                        if (!window.encoderInfo[rendererID].started) {
                            let h264filestream = FFmpegModule.FS.open("firstframe.h264", "w+");
                            FFmpegModule.FS.write(h264filestream, uarr, 0, uarr.length, 0);
                            var fn_ptr = FFmpegModule.allocate(intArrayFromString(targetPath), ALLOC_NORMAL);
                            FFmpegModule._start_bg_encode2($7, fn_ptr, $0, $1, $2, $3, $4, $5, 0);
                            FFmpegModule._free(fn_ptr);
                            window.encoderInfo[rendererID].started = true
                        }
                        var ptr = FFmpegModule._malloc(uarr.length);
                        FFmpegModule.HEAPU8.set(uarr, ptr);
                        FFmpegModule._queue_video_packet_mux($7, ptr, uarr.length, chunk.type == "key" ? 1 : 0);
                        var allFramesDone = _proxyFrameEncoded(rendererID);
                        if (allFramesDone) {
                            FFmpegModule._finish_bg_encode(rendererID)
                        }
                    }
                }
            }
            encoderinit = {};
            encoderinit.output = encoderOutputHandlerCreator($7, targetFile);
            encoderinit.error = e => {
                console.error(e.message)
            };
            encoderconfig = {};
            if ($3 == 3) {
                encoderconfig.codec = "vp09.00.10.08"
            } else {
                encoderconfig.codec = "avc1.420029";
                encoderconfig.avc = {
                    format: "annexb"
                }
            }
            encoderconfig.width = $10;
            encoderconfig.height = $11;
            encoderconfig.bitrate = $4;
            encoderconfig.framerate = $2;
            proxyencoder = new VideoEncoder(encoderinit);
            proxyencoder.configure(encoderconfig)
        })()
    },
    810278: () => {
        window.afileinput = document.createElement("input");
        window.afileinput.type = "file";
        window.afileinput.accept = ".mp4,.mov,.mpv,.jpg,.gif,.png,.webp,.jpeg,.mp3";
        window.afileinput.onchange = e => {
            if (window.afileinput.files.length == 0) return;
            var file = window.afileinput.files[0];
            var filename = window.afileinput.value;
            if (filename) {
                var backslash = String.fromCharCode(92);
                var startIndex = filename.indexOf(backslash) >= 0 ? filename.lastIndexOf(backslash) : filename.lastIndexOf("/");
                if (startIndex >= 0) filename = filename.substring(startIndex + 1)
            } else {
                filename = "unnamed"
            }
            var fr = new FileReader;
            fr.onload = async function() {
                var data = new Uint8Array(fr.result);
                const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
                try {
                    FS.unlink(filename)
                } catch (error) {}
                FFmpegModule["FS_createDataFile"]("/", filename, data, true, true, true);
                console.log("loaded file for FF: " + filename);
                window.afileinput.value = ""
            };
            fr.readAsArrayBuffer(file)
        };
        window.afileinput.click()
    },
    811439: $0 => {
        let ffcmd = function(args) {
            return new Promise(function(resolve, reject) {
                ffmpegcmd_bg_finished = function() {
                    resolve("done")
                };
                var args_ptr = FFmpegModule.allocate(intArrayFromString(args));
                FFmpegModule._ffmpegcmd_bg(args_ptr);
                FFmpegModule._free(args_ptr)
            })
        };
        (async () => {
            let cmd = "ffmpeg " + UTF8ToString($0);
            console.log("ff start, cmd: " + cmd);
            await ffcmd(cmd);
            console.log("ff end");
            let content = FFmpegModule.FS.readFile("out.mp4");
            var a = document.createElement("a");
            a.download = "result" + Math.floor(Date.now() / 1e3) + ".mp4";
            a.href = URL.createObjectURL(new Blob([content], {
                type: "video/mp4"
            }));
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                URL.revokeObjectURL(a.href);
                document.body.removeChild(a)
            }, 2e3)
        })()
    },
    812226: ($0, $1, $2, $3) => {
        try {
            let testdecoder = new VideoDecoder({
                output: frame => {
                    _enableHEVCForWebcodecs();
                    frame.close()
                },
                error: err => {}
            });
            testdecoder.configure({
                description: new Uint8Array(HEAPU8.buffer, $0, $1),
                codec: "hvc1.1.6.L60.90"
            });
            var packetBuffArray = new Uint8Array(window.Module.HEAPU8.buffer, $2, $3);
            var packetBuff_ab = new ArrayBuffer(packetBuffArray.byteLength);
            var packetBuff = new Uint8Array(packetBuff_ab);
            packetBuff.set(packetBuffArray);
            const chunk = new EncodedVideoChunk({
                type: "key",
                timestamp: 0,
                duration: 1e3,
                data: packetBuff
            });
            testdecoder.decode(chunk);
            testdecoder.flush()
        } catch (e) {}
    },
    812856: () => {
        (async () => {
            window.screenCaptureStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "never"
                },
                audio: false,
                cursor: false
            });
            console.log(window.screenCaptureStream.getVideoTracks()[0].getSettings());
            var elemDiv1 = document.createElement("video");
            elemDiv1.style.cssText = "position:absolute;width:240px;height:180px;z-index:100;background:#000;left:240px;right:0;";
            elemDiv1.srcObject = window.screenCaptureStream;
            document.body.appendChild(elemDiv1);
            elemDiv1.play()
        })()
    },
    813357: ($0, $1) => {
        (async () => {
            window.mediaCaptureStream = await navigator.mediaDevices.getUserMedia({
                video: $0 == 1,
                audio: $1 == 1
            });
            var elemDiv = document.createElement("video");
            elemDiv.style.cssText = "position:absolute;width:240px;height:180px;z-index:100;background:#000;left:0;right:0;";
            elemDiv.srcObject = window.mediaCaptureStream;
            document.body.appendChild(elemDiv);
            elemDiv.play()
        })()
    },
    813747: () => {
        (async () => {
            window.screenRecorder = new MediaRecorder(window.screenCaptureStream);
            window.screenRecorderIsFinishing = false;
            window.screenRecorderIsProcessingData = false;
            window.screenRecorder.ondataavailable = async e => {
                console.log(e);
                window.screenRecorderIsProcessingData = true;
                let da = await e.data.arrayBuffer();
                let da8 = new Uint8Array(da);
                var ptr = Module._malloc(e.data.size);
                Module.HEAPU8.set(da8, ptr);
                _jsPassBrowserRecordedStream(ptr, e.data.size, 0);
                Module._free(ptr);
                window.screenRecorderIsProcessingData = false;
                if (window.screenRecorderIsFinishing) {
                    _jsBrowserRecorderStopped(0)
                }
            };
            window.screenRecorder.onstop = e => {
                if (window.screenRecorderIsProcessingData) {
                    window.screenRecorderIsFinishing = true
                } else {
                    _jsBrowserRecorderStopped(0)
                }
                window.screenCaptureStream.getTracks().forEach(track => track.stop())
            };
            window.screenRecorder.start()
        })()
    },
    814648: () => {
        (async () => {
            window.mediaRecorder = new MediaRecorder(window.mediaCaptureStream);
            window.mediaRecorderIsFinishing = false;
            window.mediaRecorderIsProcessingData = false;
            window.mediaRecorder.ondataavailable = async e => {
                console.log(e);
                window.mediaRecorderIsProcessingData = true;
                let da = await e.data.arrayBuffer();
                let da8 = new Uint8Array(da);
                var ptr = Module._malloc(e.data.size);
                Module.HEAPU8.set(da8, ptr);
                _jsPassBrowserRecordedStream(ptr, e.data.size, 1);
                Module._free(ptr);
                window.mediaRecorderIsProcessingData = false;
                if (window.mediaRecorderIsFinishing) {
                    _jsBrowserRecorderStopped(1)
                }
            };
            window.mediaRecorder.onstop = e => {
                if (window.mediaRecorderIsProcessingData) {
                    window.mediaRecorderIsFinishing = true
                } else {
                    _jsBrowserRecorderStopped(1)
                }
                window.mediaCaptureStream.getTracks().forEach(track => track.stop())
            };
            window.mediaRecorder.start()
        })()
    },
    815536: () => {
        window.screenRecorder.stop()
    },
    815570: () => {
        window.mediaRecorder.stop()
    },
    815603: () => {
        if (navigator.userAgent.toLowerCase().indexOf("android") > -1) return 0;
        if ("VideoEncoder" in window) return 1;
        return 0
    },
    815730: () => {
        window.ffLoadFileResultCallback = (buff, buffsize, assetref) => {
            _guVideoFFLoadFinished(buff, buffsize, assetref)
        }
    },
    815851: () => {
        window.ffLoadFileProgressCallback = (percent, vidref) => {
            _jsLoadFileProgressCallback(percent, vidref)
        }
    },
    815963: ($0, $1) => {
        let path = UTF8ToString($0);
        var ptr = FFmpegModule.allocate(FFmpegModule.intArrayFromString(path), FFmpegModule.ALLOC_NORMAL);
        FFmpegModule._openFile(-1, 0, 0, 0, 0, ptr, $1)
    },
    816144: ($0, $1) => {
        if (typeof window.emfiles === "undefined") {
            window.emfiles = {}
        }
        if (typeof window.openFiles === "undefined") {
            window.openFiles = {}
        }
        window.emfiles[$1] = FS.open(UTF8ToString($0), "r")
    },
    816341: ($0, $1, $2, $3, $4, $5) => {
        FFworker.postMessage({
            "cmd": "openfile",
            "args": {
                "fileHandleID": $0,
                "offset_h": $1,
                "offset_l": $2,
                "size_h": $3,
                "size_l": $4,
                "ref": $5
            }
        })
    },
    816501: ($0, $1, $2, $3, $4, $5) => {
        FFmpegModule._openFile($0, $1, $2, $3, $4, 0, $5)
    },
    816556: ($0, $1, $2, $3, $4, $5) => {
        FFworker.postMessage({
            "cmd": "openfile",
            "args": {
                "fileHandleID": $0,
                "offset_h": $1,
                "offset_l": $2,
                "size_h": $3,
                "size_l": $4,
                "ref": $5
            }
        })
    },
    816716: ($0, $1, $2) => {
        var bufArr = new Uint8Array(HEAPU8.buffer, $1, $2);
        var bufFFPtr = FFmpegModule.allocate(bufArr, FFmpegModule.ALLOC_NORMAL);
        FFmpegModule._deliverFileHandleReadResult($0, bufFFPtr, $2);
        FFmpegModule._free(bufFFPtr)
    },
    816936: $0 => {
        return FFmpegModule._getFFVideoDecoderDuration($0)
    },
    816992: $0 => {
        return FFmpegModule._getFFVideoDecoderFrameRotation($0)
    },
    817053: $0 => {
        return FFmpegModule._getFFVideoDecoderFrameWidth($0)
    },
    817111: $0 => {
        return FFmpegModule._getFFVideoDecoderFrameHeight($0)
    },
    817170: ($0, $1) => {
        decodersByPRId[$0].flush().then(() => {
            _webCodecsFlushPromiseResolved($1, $0, 1, -1)
        }).catch(e => {
            console.log("flush error (p): " + e)
        })
    },
    817314: ($0, $1, $2, $3, $4, $5) => {
        var packetptr = $1;
        var packetsize = $2;
        var packetBuffArray = new Uint8Array(window.Module.HEAPU8.buffer, packetptr, packetsize);
        var packetBuff_ab = new ArrayBuffer(packetBuffArray.byteLength);
        var packetBuff = new Uint8Array(packetBuff_ab);
        packetBuff.set(packetBuffArray);
        const typ = $3 ? "key" : "delta";
        const ts = $5;
        const chunk = new EncodedVideoChunk({
            type: typ,
            timestamp: ts - $4,
            duration: 1e3,
            data: packetBuff
        });
        try {
            decodersByPRId[$0].decode(chunk)
        } catch (exception) {
            if (typ == "key") {
                _jsInvalidateKeyFrame($0, ts);
                return -2
            }
        }
        return ts
    },
    817914: ($0, $1, $2, $3, $4) => {
        var packetBuffArray = new Uint8Array(window.Module.HEAPU8.buffer, $1, $2);
        var packetBuff_ab = new ArrayBuffer(packetBuffArray.byteLength);
        var packetBuff = new Uint8Array(packetBuff_ab);
        packetBuff.set(packetBuffArray);
        const typ = $3 ? "key" : "delta";
        const chunk = new EncodedAudioChunk({
            type: typ,
            timestamp: $4,
            data: packetBuff
        });
        decodersByPRId[$0].decode(chunk)
    },
    818292: ($0, $1, $2, $3, $4, $5, $6, $7) => {
        FFmpegModule._start_bg_encode($0, $1, $2, $3, $4, $5, $6, $7)
    },
    818350: ($0, $1) => {
        if (typeof window.ffmpegOutputDownload === "undefined") {
            window.ffmpegOutputDownload = {}
        }
        window.ffmpegOutputDownload[$1] = rendererID => {
            var fileext = "mp4";
            var mime = "video/mp4";
            if ($0 == 2 || $0 == 3) {
                fileext = "webm";
                mime = "video/webm"
            }
            if ($0 == 4) {
                fileext = "gif";
                mime = "image/gif"
            }
            let content = FFmpegModule.FS.readFile("out." + fileext);
            var a = document.createElement("a");
            a.download = "result" + Math.floor(Date.now() / 1e3) + "." + fileext;
            a.href = URL.createObjectURL(new Blob([content], {
                type: mime
            }));
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href)
            }, 2e3);
            _videoExportFinishedWithSuccess(rendererID)
        };
        if (FFworker == null) {
            FFmpegModule._finish_bg_encode($1)
        } else {
            FFworker.postMessage({
                "cmd": "finish_bg_encode",
                "args": {
                    "rid": $1
                }
            })
        }
    },
    819239: $0 => {
        f = FS.readFile("videobuffer", {});
        FFmpegModule.FS.writeFile("videobuffer", f);
        f = {};
        FFmpegModule._start_video_frame_encode($0)
    },
    819375: ($0, $1, $2) => {
        let audbuff = new Uint8Array(window.Module.HEAPU8.buffer, $0, $1);
        if (FFworker == null) {
            var audbuff_ptr = FFmpegModule._malloc($1);
            FFmpegModule.HEAPU8.set(audbuff, audbuff_ptr);
            FFmpegModule._start_audio_frame_encode($2, audbuff_ptr, $1)
        } else {
            let bc = new Uint8Array(audbuff.length);
            bc.set(audbuff);
            FFworker.postMessage({
                "cmd": "start_audio_frame_encode",
                "args": {
                    "buff": bc,
                    "rid": $2
                }
            })
        }
    },
    819779: () => {
        if (window.showSaveFilePicker) return 1;
        else return 0
    },
    819839: ($0, $1, $2, $3, $4, $5, $6, $7, $8) => {
        (async () => {
            var rendererID = $7;
            var targetLocation = $8;
            var opts = {};
            opts.types = [];
            if ($3 == 3) {
                opts.types.push({
                    description: "Video file",
                    accept: {
                        "video/webm": [".webm"]
                    }
                })
            } else {
                opts.types.push({
                    description: "Video file",
                    accept: {
                        "video/mp4": [".mp4"]
                    }
                })
            }
            var fh = null;
            var targetPath = null;
            if (window.showSaveFilePicker && targetLocation == 0) {
                try {
                    fh = await window.showSaveFilePicker(opts)
                } catch (err) {
                    return
                }
            }
            if (fh) {
                if (!window.renderTargetFiles) {
                    window.renderTargetFiles = {};
                    window.renderTargetFileSizes = {};
                    window.renderTargetFilePositions = {}
                }
                window.renderTargetFiles[rendererID] = await fh.createWritable();
                window.renderTargetFileSizes[rendererID] = 0;
                window.renderTargetFilePositions[rendererID] = 0;
                window.writeToVideoOutputFile = function(fileHandleID, buff) {
                    var b2 = new ArrayBuffer(buff.byteLength);
                    new Uint8Array(b2).set(new Uint8Array(buff));
                    window.renderTargetFiles[fileHandleID].write(b2);
                    window.renderTargetFilePositions[fileHandleID] += buff.byteLength;
                    window.renderTargetFileSizes[fileHandleID] = Math.max(window.renderTargetFileSizes[fileHandleID], window.renderTargetFilePositions[fileHandleID])
                };
                window.seekVideoOutputFile = function(fileHandleID, pos, whence) {
                    window.renderTargetFiles[fileHandleID].write({
                        type: "seek",
                        position: pos
                    });
                    window.renderTargetFilePositions[fileHandleID] = pos
                }
            } else {
                targetPath = "out.mp4";
                if ($3 == 3) targetPath = "out.webm";
                if (targetLocation != 0) {
                    targetPath = UTF8ToString(targetLocation)
                }
                if (!window.renderTargetPaths) {
                    window.renderTargetPaths = {}
                }
                renderTargetPaths[rendererID] = targetPath
            }
            window.encoderInfo = {};
            window.encoderInfo[rendererID] = {};
            window.encoderInfo[rendererID].started = false;

            function encoderOutputHandlerCreator(rendererID, withfilehandle, targetPath) {
                return function(chunk, metadata) {
                    if (metadata && metadata.decoderConfig) {
                        if (metadata.decoderConfig.colorSpace) {
                            let cs = metadata.decoderConfig.colorSpace;
                            const color_primaries = {
                                "bt709": 1,
                                "bt470bg": 5,
                                "smpte170m": 6,
                                "bt2020": 9,
                                "smpte432": 12
                            };
                            const color_transfer = {
                                "bt709": 1,
                                "smpte170m": 6,
                                "iec61966-2-1": 13,
                                "linear": 8,
                                "pq": 16,
                                "hlg": 18
                            };
                            const color_matrix = {
                                "rgb": 0,
                                "bt709": 1,
                                "bt470bg": 5,
                                "smpte170m": 6,
                                "bt2020-ncl": 9
                            };
                            if (FFworker == null) {
                                FFmpegModule._set_h264_raw_colorspace("primaries" in cs && cs.primaries in color_primaries ? color_primaries[cs.primaries] : 0, "transfer" in cs && cs.transfer in color_transfer ? color_transfer[cs.transfer] : 0, "matrix" in cs && cs.matrix in color_matrix ? color_matrix[cs.matrix] : 0, "fullRange" in cs ? cs.fullRange ? 1 : 0 : 0)
                            } else {
                                FFworker.postMessage({
                                    "cmd": "set_h264_raw_colorspace",
                                    "args": {
                                        "p": "primaries" in cs && cs.primaries in color_primaries ? color_primaries[cs.primaries] : 0,
                                        "t": "transfer" in cs && cs.transfer in color_transfer ? color_transfer[cs.transfer] : 0,
                                        "m": "matrix" in cs && cs.matrix in color_matrix ? color_matrix[cs.matrix] : 0,
                                        "r": "fullRange" in cs ? cs.fullRange ? 1 : 0 : 0
                                    }
                                })
                            }
                        }
                    }
                    if (chunk.data) {
                        var uarr = new Uint8Array(chunk.data)
                    } else {
                        var uarr = new Uint8Array(chunk.byteLength);
                        chunk.copyTo(uarr)
                    }
                    if (uarr.length > 0) {
                        if (!window.encoderInfo[rendererID].started) {
                            if (FFworker == null) {
                                let h264filestream = FFmpegModule.FS.open("firstframe.h264", "w+");
                                FFmpegModule.FS.write(h264filestream, uarr, 0, uarr.length, 0)
                            } else {
                                let acopy = new Uint8Array(uarr.length);
                                acopy.set(uarr);
                                FFworker.postMessage({
                                    "cmd": "firstframe",
                                    "buff": acopy
                                })
                            }
                            if (FFworker == null) {
                                var fn_ptr = 0;
                                if (withfilehandle) {
                                    fn_ptr = FFmpegModule.allocate(intArrayFromString("#" + rendererID), ALLOC_NORMAL)
                                } else {
                                    fn_ptr = FFmpegModule.allocate(intArrayFromString(targetPath), ALLOC_NORMAL)
                                }
                                FFmpegModule._start_bg_encode2($7, fn_ptr, $0, $1, $2, $3, $4, $5, $6);
                                FFmpegModule._free(fn_ptr)
                            } else {
                                let fn = withfilehandle ? "#" + rendererID : targetPath;
                                FFworker.postMessage({
                                    "cmd": "start_bg_encode2",
                                    "args": {
                                        "rid": $7,
                                        "fn": fn,
                                        "width": $0,
                                        "height": $1,
                                        "fps": $2,
                                        "format": $3,
                                        "bitrate": $4,
                                        "pixformat": $5,
                                        "audiochannels": $6
                                    }
                                })
                            }
                            window.encoderInfo[rendererID].started = true
                        }
                        if (FFworker == null) {
                            var ptr = FFmpegModule._malloc(uarr.length);
                            FFmpegModule.HEAPU8.set(uarr, ptr);
                            FFmpegModule._queue_video_packet_mux($7, ptr, uarr.length, chunk.type == "key" ? 1 : 0)
                        } else {
                            let acopy = new Uint8Array(uarr.length);
                            acopy.set(uarr);
                            FFworker.postMessage({
                                "cmd": "queue_video_packet_mux",
                                "args": {
                                    "rid": $7,
                                    "buff": acopy,
                                    "iskey": chunk.type == "key" ? 1 : 0
                                }
                            })
                        }
                        _wcFrameEncoded(rendererID)
                    }
                }
            }
            encoderinit = {};
            encoderinit.output = encoderOutputHandlerCreator($7, fh ? 1 : 0, targetPath);
            encoderinit.error = e => {
                console.error("VideoEncoder encoder error, retrying with ffmpeg, " + e.message);
                _retryRendererWithWasmOpenH264($7)
            };
            encoderconfig = {};
            encoderconfig.width = $0;
            encoderconfig.height = $1;
            encoderconfig.bitrate = $4;
            encoderconfig.framerate = $2;
            if ($3 == 3) {
                encoderconfig.codec = "vp09.00.10.08"
            } else {
                encoderconfig.avc = {
                    format: "annexb"
                };
                try {
                    encoderconfig.codec = "avc1.640034";
                    let sup = await VideoEncoder.isConfigSupported(encoderconfig);
                    if (!sup.supported) {
                        encoderconfig.codec = "avc1.420029"
                    }
                } catch (e) {
                    encoderconfig.codec = "avc1.420029"
                }
                encoderconfig.codec = navigator.platform && navigator.platform.indexOf("Win") > -1 ? "avc1.420029" : "avc1.640034";
                encoderconfig.avc = {
                    format: "annexb"
                }
            }
            try {
                if (navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && navigator.userAgent.indexOf("CriOS") == -1 && navigator.userAgent.indexOf("FxiOS") == -1) {
                    throw "safari"
                }
                webmencoder = new VideoEncoder(encoderinit);
                webmencoder.configure(encoderconfig);
                _encoderInitJSDone(rendererID)
            } catch (e) {
                console.error("encoder configure error, retrying with ffmpeg ", e);
                _retryRendererWithWasmOpenH264(rendererID)
            }
        })()
    },
    825779: () => {},
    825783: ($0, $1, $2) => {
        let audbuff = new Uint8Array(window.Module.HEAPU8.buffer, $0, $1);
        if (FFworker == null) {
            var audbuff_ptr = FFmpegModule._malloc($1);
            FFmpegModule.HEAPU8.set(audbuff, audbuff_ptr);
            FFmpegModule._start_audio_frame_encode($2, audbuff_ptr, $1)
        } else {
            let bc = new Uint8Array(audbuff.length);
            bc.set(audbuff);
            FFworker.postMessage({
                "cmd": "start_audio_frame_encode",
                "args": {
                    "buff": bc,
                    "rid": $2
                }
            })
        }
    },
    826187: ($0, $1, $2, $3, $4, $5, $6) => {
        (async () => {
            let fbuff = new Uint8ClampedArray(Module.HEAPU8.buffer, $0, $1);
            let frameImageData = new ImageData(fbuff.slice(0, $1), $4, $5);
            const bitmap = await createImageBitmap(frameImageData);
            let timestamp = 1 / $3 * $2;
            timestamp *= 1e6;
            let frame = new VideoFrame(bitmap, {
                timestamp: timestamp
            });
            const ret = webmencoder.encode(frame, {
                keyFrame: $2 % 30 === 0
            });
            frame.close();
            if ($2 == $6 - 1) {
                await webmencoder.flush();
                await webmencoder.close()
            }
        })()
    },
    826671: () => {
        webmencoder.flush();
        webmencoder.close()
    },
    826717: $0 => {
        setTimeout(() => {
            _ffwcCheckForTask($0, 1)
        }, 10)
    },
    826773: () => {
        webmencoder.flush();
        webmencoder.close()
    },
    826819: ($0, $1) => {
        if (typeof window.ffmpegOutputDownload === "undefined") {
            window.ffmpegOutputDownload = {}
        }
        window.ffmpegOutputDownload[$1] = rendererID => {
            (async () => {
                let outfileext = $0 == 3 ? "webm" : "mp4";
                let outfilemime = $0 == 3 ? "video/webm" : "video/mp4";
                let content = FFmpegModule.FS.readFile("out." + outfileext);
                var a = document.createElement("a");
                a.download = "result" + Math.floor(Date.now() / 1e3) + "." + outfileext;
                a.href = URL.createObjectURL(new Blob([content], {
                    type: outfilemime
                }));
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    URL.revokeObjectURL(a.href);
                    document.body.removeChild(a)
                }, 2e3);
                _videoExportFinishedWithSuccess(rendererID)
            })()
        };
        if (FFworker == null) {
            FFmpegModule._finish_bg_encode($1)
        } else {
            FFworker.postMessage({
                "cmd": "finish_bg_encode",
                "args": {
                    "rid": $1
                }
            })
        }
    },
    827675: ($0, $1) => {
        if (typeof window.ffmpegOutputDownload === "undefined") {
            window.ffmpegOutputDownload = {}
        }
        window.ffmpegOutputDownload[$1] = rendererID => {
            (async () => {
                if (window.renderTargetFiles && rendererID in window.renderTargetFiles) {
                    await window.renderTargetFiles[rendererID].close()
                }
                if (window.renderTargetPaths && rendererID in window.renderTargetPaths) {
                    f = FFmpegModule.FS.readFile(window.renderTargetPaths[rendererID], {});
                    FS.writeFile(window.renderTargetPaths[rendererID], f)
                }
                _videoExportFinishedWithSuccess(rendererID)
            })()
        };
        if (FFworker == null) {
            FFmpegModule._finish_bg_encode($1)
        } else {
            FFworker.postMessage({
                "cmd": "finish_bg_encode",
                "args": {
                    "rid": $1
                }
            })
        }
    },
    828369: $0 => {
        setTimeout(() => {
            _ffwcCheckForTask($0, 1)
        }, 10)
    },
    828425: $0 => {
        setTimeout(() => {
            _ffwcCheckForTask($0, 1)
        }, 10)
    },
    828481: $0 => {
        var f = FS.readFile("out" + $0 + ".jpg", {});
        FFmpegModule.FS.writeFile("out" + $0 + ".jpg", f)
    },
    828573: ($0, $1) => {
        let ffcmd = function(args) {
            return new Promise(function(resolve, reject) {
                ffmpegcmd_bg_finished = function() {
                    resolve("done")
                };
                var args_ptr = FFmpegModule.allocate(intArrayFromString(args));
                FFmpegModule._ffmpegcmd_bg(args_ptr);
                FFmpegModule._free(args_ptr)
            })
        };
        (async () => {
            console.log("done gif first pass");
            var str_ptr = allocate(FFmpegModule.intArrayFromString("Generating palette..."), FFmpegModule.ALLOC_NORMAL);
            _GUVideoExportReportProgress($1, -1, str_ptr, 0, 0, 0);
            _free(str_ptr);
            var exportFPS = $0;
            await ffcmd("ffmpeg -y -nostdin -framerate " + exportFPS + " -f image2 -i out%d.jpg -vf palettegen palette.bmp");
            var str_ptr = allocate(FFmpegModule.intArrayFromString("Creating gif..."), FFmpegModule.ALLOC_NORMAL);
            _GUVideoExportReportProgress($1, -1, str_ptr, 0, 0, 0);
            _free(str_ptr);
            var qm = quoteMarkThatDoesntKillEmscripten();
            await ffcmd("ffmpeg -y -nostdin -framerate " + exportFPS + " -f image2 -i out%d.jpg -i palette.bmp -filter_complex paletteuse=dither=sierra2_4a out.gif");
            let content = FFmpegModule.FS.readFile("out.gif");
            var a = document.createElement("a");
            a.download = "result" + Math.floor(Date.now() / 1e3) + ".gif";
            a.href = URL.createObjectURL(new Blob([content], {
                type: "image/gif"
            }));
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                URL.revokeObjectURL(a.href);
                document.body.removeChild(a)
            }, 2e3);
            var str_ptr = allocate(FFmpegModule.intArrayFromString("Finished"), FFmpegModule.ALLOC_NORMAL);
            _GUVideoExportReportProgress($1, -1, str_ptr, 1, 0, 0);
            _free(str_ptr)
        })()
    },
    830117: () => {
        return typeof document === "undefined" ? 1 : 0
    },
    830171: () => {
        return typeof document === "undefined" ? 1 : 0
    },
    830225: () => {
        var isSafari = navigator.vendor && navigator.vendor.indexOf("Apple") > -1 && navigator.userAgent && navigator.userAgent.indexOf("CriOS") == -1 && navigator.userAgent.indexOf("FxiOS") == -1;
        return isSafari
    },
    830436: () => {
        return typeof document === "undefined" ? 1 : 0
    },
    830490: $0 => {
        let audioCtx = new AudioContext;
        _setAudioPlaySampleRate(audioCtx.sampleRate);
        let scriptNode = audioCtx.createScriptProcessor(4096, 0, 1);
        scriptNode.onaudioprocess = function(audioProcessingEvent) {
            let outputBuffer = audioProcessingEvent.outputBuffer;
            let sampleCount = outputBuffer.length;
            var ptr = Module._malloc(2 * 2 * sampleCount);
            let hasData = _getAudioPlayBuffer_safari(ptr, sampleCount, $0);
            var inbuff = Module.HEAP16.subarray(ptr / 2, ptr / 2 + 2 * sampleCount);
            for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                let outputData = outputBuffer.getChannelData(channel);
                for (let sample = 0; sample < outputBuffer.length; sample++) {
                    outputData[sample] = inbuff[sample * 2 + channel] / 32768
                }
            }
            Module._free(ptr);
            if (!hasData) {
                scriptNode.disconnect(audioCtx.destination)
            }
        };
        scriptNode.connect(audioCtx.destination)
    },
    831358: () => {
        try {
            const audioCtx = new AudioContext;
            return audioCtx.outputLatency * 1e3
        } catch (error) {
            return 0
        }
    },
    831474: () => {
        class AudioWorkletProcessor {}

        function addAudioWorklet(context, proc) {
            var f = "data:text/javascript," + encodeURI(proc.toString()) + ';\nregisterProcessor("' + proc.name + '",' + proc.name + ")";
            return context.audioWorklet.addModule(f)
        }
        class BufferedAudioWorkletProcessor extends AudioWorkletProcessor {
            constructor() {
                super();
                this.doff = 0;
                this.port.onmessage = this.handleMessage_.bind(this)
            }
            handleMessage_(event) {
                if (event.data.sab) {
                    this.sab = event.data.sab;
                    this.sab_i16 = new Int16Array(this.sab);
                    this.sab_ix = 0;
                    this.sab_total_ix = 0;
                    this.sab_next_req = event.data.nextreq;
                    this.sab_samplerate = event.data.samplerate
                }
            }
            process(inputs, outputs, parameters) {
                const output = outputs[0];
                var playSampleRate = this.sab_samplerate;
                if (this.sab) {
                    var i;
                    for (i = 0; i < output[0].length; i++) {
                        output[0][i] = this.sab_i16[this.sab_ix * 2] / 32767;
                        if (output.length > 1) output[1][i] = this.sab_i16[this.sab_ix * 2 + 1] / 32767;
                        this.sab_ix += 1;
                        this.sab_total_ix += 1;
                        if (this.sab_ix == playSampleRate) this.sab_ix = 0
                    }
                    if (this.sab_total_ix > this.sab_next_req - playSampleRate / 5) {
                        this.port.postMessage(this.sab_next_req);
                        this.sab_next_req += playSampleRate / 10
                    }
                } else {
                    for (i = 0; i < output[0].length; i++) {
                        output[0][i] = 0;
                        if (output.length > 1) output[1][i] = 0
                    }
                }
                return true
            }
        }

        function writeAudioBuffer(fromSampleIx) {
            var playSampleRate = _getAudioPlaySampleRate();
            var ptr = Module._malloc(2 * 2 * playSampleRate / 10);
            _getAudioPlayBuffer(ptr);
            var inbuff = Module.HEAP16.subarray(ptr / 2, ptr / 2 + 2 * playSampleRate / 10);
            for (var i = 0; i < playSampleRate / 10; i++) {
                window.audio_sab_int16[window.audio_sab_sampleix * 2] = inbuff[i * 2];
                window.audio_sab_int16[window.audio_sab_sampleix * 2 + 1] = inbuff[i * 2 + 1];
                window.audio_sab_sampleix += 1;
                if (window.audio_sab_sampleix == playSampleRate) window.audio_sab_sampleix = 0
            }
            Module._free(ptr)
        }
        const startAudioPlay = async () => {
            if (!window.audioPlayContext) {
                window.audioPlayContext = new AudioContext;
                await addAudioWorklet(window.audioPlayContext, BufferedAudioWorkletProcessor);
                bufferedAWN = new AudioWorkletNode(window.audioPlayContext, "BufferedAudioWorkletProcessor", {
                    "outputChannelCount": [2]
                })
            }
            window.audio_sab = new SharedArrayBuffer(2 * _getAudioPlaySampleRate() * Int16Array.BYTES_PER_ELEMENT);
            window.audio_sab_int16 = new Int16Array(window.audio_sab);
            window.audio_sab_int16.fill(0);
            window.audio_sab_sampleix = 0;
            _setAudioPlaySampleRate(window.audioPlayContext.sampleRate);
            writeAudioBuffer(0);
            writeAudioBuffer(_getAudioPlaySampleRate() / 10);
            bufferedAWN.port.onmessage = event => {
                writeAudioBuffer(event.data)
            };
            bufferedAWN.connect(window.audioPlayContext.destination);
            bufferedAWN.port.postMessage({
                "sab": window.audio_sab,
                "nextreq": 2 * _getAudioPlaySampleRate() / 10,
                "samplerate": _getAudioPlaySampleRate()
            })
        };
        startAudioPlay()
    },
    834319: () => {
        if (window.audioPlayContext) window.audioPlayContext.close();
        window.audioPlayContext = null
    },
    834417: () => {
        if (window.audioPlayContext) window.audioPlayContext.close();
        window.audioPlayContext = null
    },
    834515: () => {
        if (navigator.userAgent.toLowerCase().indexOf("android") > -1 || navigator.userAgent.indexOf("iPhone;") > -1) {
            document.getElementById("dummyinput").inputMode = "text";
            document.getElementById("canvas").inputMode = "text";
            document.getElementById("dummyinput").focus({
                preventScroll: true
            })
        }
    },
    834816: () => {
        if (navigator.userAgent.toLowerCase().indexOf("android") > -1 || navigator.userAgent.indexOf("iPhone;") > -1) {
            document.getElementById("canvas").inputMode = "none";
            document.getElementById("dummyinput").inputMode = "none"
        }
    },
    835050: () => {
        return ptr = allocate(intArrayFromString(document.cookie), ALLOC_NORMAL)
    },
    835128: () => {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        document.cookie = "d=" + result
    },
    835415: () => {
        return ptr = allocate(intArrayFromString(document.cookie), ALLOC_NORMAL)
    },
    835493: () => {
        setTimeout(function() {
            _guRunTasks()
        })
    },
    835540: $0 => {
        const pickerOptsStr = UTF8ToString($0);
        const pickerOpts = JSON.parse(UTF8ToString($0));
        (async () => {
            var fileHandles = await window.showOpenFilePicker(pickerOpts);
            if (typeof window.openFileHandles === "undefined") {
                window.openFileHandles = {};
                window.openFiles = {}
            }
            var needsToClear = 1;
            for (let i = 0; i < fileHandles.length; i++) {
                var fhid = _jsGetNextFileHandleID();
                window.openFileHandles[fhid] = fileHandles[i];
                window.openFiles[fhid] = await fileHandles[i].getFile();
                var filename_ptr = allocate(intArrayFromString(fileHandles[i].name), ALLOC_NORMAL);
                let fsize = window.openFiles[fhid].size;
                let fsize_lo = fsize & 268435455;
                let fsize_hi = (fsize - fsize_lo) / 268435455;
                _jsFileHandlePickerSetFile(needsToClear, fhid, filename_ptr, fsize_lo, fsize_hi);
                _free(filename_ptr);
                needsToClear = 0
            }
            _jsFileHandlePickerDone()
        })()
    },
    836392: ($0, $1, $2, $3) => {
        (async (ext, mime, descr, guFileHandleID) => {
            var opts = {};
            opts.types = [];
            opts.types.push({
                description: descr
            });
            opts.types[0]["accept"] = {};
            opts.types[0]["accept"][mime] = "." + ext;
            let fh = null;
            if (window.showSaveFilePicker) {
                try {
                    fh = await window.showSaveFilePicker(opts)
                } catch (err) {
                    console.log(err);
                    return
                }
            }
            if (fh) {
                if (typeof window.openFileHandles === "undefined") {
                    window.openFileHandles = {};
                    window.openFiles = {}
                }
                if (!window.renderTargetFiles) {
                    window.renderTargetFiles = {};
                    window.renderTargetFileSizes = {};
                    window.renderTargetFilePositions = {}
                }
                window.openFileHandles[guFileHandleID] = fh;
                window.renderTargetFiles[guFileHandleID] = await fh.createWritable();
                window.renderTargetFileSizes[guFileHandleID] = 0;
                window.renderTargetFilePositions[guFileHandleID] = 0;
                window.writeToVideoOutputFile = function(fileHandleID, buff) {
                    var b2 = new ArrayBuffer(buff.byteLength);
                    new Uint8Array(b2).set(new Uint8Array(buff));
                    window.renderTargetFiles[fileHandleID].write(b2);
                    window.renderTargetFilePositions[fileHandleID] += buff.byteLength;
                    window.renderTargetFileSizes[fileHandleID] = Math.max(window.renderTargetFileSizes[fileHandleID], window.renderTargetFilePositions[fileHandleID])
                };
                window.seekVideoOutputFile = function(fileHandleID, pos, whence) {
                    window.renderTargetFiles[fileHandleID].write({
                        type: "seek",
                        position: pos
                    });
                    window.renderTargetFilePositions[fileHandleID] = pos
                };
                _jsWritableFileHandlePickerDone(guFileHandleID, "dummyfilename")
            }
        })(UTF8ToString($0), UTF8ToString($1), UTF8ToString($2), $3)
    },
    837963: ($0, $1, $2, $3, $4) => {
        (async () => {
            let offs = $2 * 268435456 + $1;
            const slicebuff = await window.openFiles[$0].slice(offs, offs + $3).arrayBuffer();
            const slicearr = new Uint8Array(slicebuff);
            var ptr = allocate(slicearr, ALLOC_NORMAL);
            setTimeout(function() {
                _jsFileHandleReadDone($4, ptr);
                _free(ptr)
            }, 0)
        })()
    },
    838266: () => {
        window.afileinput.value = ""
    },
    838300: ($0, $1) => {
        if (typeof window.openFileHandles === "undefined") {
            window.openFileHandles = {};
            window.openFiles = {}
        }
        let dontLoadExtensions = UTF8ToString($1);
        window.afileinput = document.createElement("input");
        window.afileinput.type = "file";
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        var hasmkv = UTF8ToString($0).indexOf("mkv") > 0;
        if (!isSafari || !hasmkv) window.afileinput.accept = UTF8ToString($0);
        window.afileinput.onchange = e => {
            if (window.afileinput.files.length == 0) return;
            _setPickedFileCount(window.afileinput.files.length);
            for (let fileIx = 0; fileIx < window.afileinput.files.length; fileIx++) {
                var file = window.afileinput.files[fileIx];
                var filename = file.name;
                var fileext = "";
                if (filename) {
                    var backslash = String.fromCharCode(92);
                    var startIndex = filename.indexOf(backslash) >= 0 ? filename.lastIndexOf(backslash) : filename.lastIndexOf("/");
                    if (startIndex >= 0) filename = filename.substring(startIndex + 1);
                    let dotIndex = filename.lastIndexOf(".");
                    if (dotIndex > 0) fileext = filename.substring(dotIndex + 1)
                } else {
                    filename = "unnamed"
                }
                var fhid = _jsGetNextFileHandleID();
                window.openFiles[fhid] = file;
                let fsize = file.size;
                let fsize_lo = fsize & 268435455;
                let fsize_hi = (fsize - fsize_lo) / 268435455;
                var hashHex = "";
                if (dontLoadExtensions.split(" ").includes(fileext)) {
                    var ptr = allocate(intArrayFromString(filename), ALLOC_NORMAL);
                    _jsFileInputGotItem(fhid, fsize_lo, fsize_hi, ptr, 0, 0);
                    _free(ptr)
                } else {
                    var fr = new FileReader;
                    fr.onload = async function() {
                        var data = new Uint8Array(fr.result);
                        if (crypto !== undefined && crypto.subtle !== undefined) {
                            const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                            const hashArray = Array.from(new Uint8Array(hashBuffer));
                            hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
                        }
                        try {
                            FS.unlink(filename)
                        } catch (error) {}
                        Module["FS_createDataFile"]("/", filename, data, true, true, true);
                        var ptr = allocate(intArrayFromString(filename), ALLOC_NORMAL);
                        var ptr2 = allocate(intArrayFromString(hashHex), ALLOC_NORMAL);
                        var ptr3 = allocate(intArrayFromString("/" + filename), ALLOC_NORMAL);
                        _jsFileInputGotItem(fhid, fsize_lo, fsize_hi, ptr, ptr2, ptr3);
                        _free(ptr);
                        _free(ptr2);
                        _free(ptr3)
                    };
                    fr.readAsArrayBuffer(file)
                }
            }
        };
        window.afileinput.click()
    },
    840642: $0 => {
        var t = UTF8ToString($0);
        navigator.clipboard.writeText(t).then(function() {}, function(err) {
            alert("error copying to clipboard: ", err)
        })
    },
    840790: () => {
        document.getElementById("lightbox").style.display = "block";
        document.getElementById("lightboxframe").src = "/about.html";
        document.getElementById("lightboxframe").style.height = window.innerHeight * 2 / 3 + "px";
        document.getElementById("lightbox-content2").style.height = window.innerHeight * 2 / 3 + "px"
    },
    841103: $0 => {
        var dirname = UTF8ToString($0);
        FS.mount(IDBFS, {}, dirname);
        FS.syncfs(true, function(err) {
            if (err) console.log("IDBFS error", err)
        })
    },
    841247: () => {
        FS.syncfs(function(err) {
            console.log("IDBFS error", err)
        })
    },
    841314: () => {
        var hs = window.location.hash || "";
        return allocate(intArrayFromString(hs), ALLOC_NORMAL)
    },
    841410: $0 => {
        _free($0)
    },
    841425: () => {
        document.addEventListener("visibilitychange", function logData() {
            if (document.visibilityState === "hidden") {
                try {
                    var ls = UTF8ToString(_getEventLog());
                    navigator.sendBeacon("https://wvm.voxeloid.com/log/", ls)
                } catch (e) {
                    navigator.sendBeacon("https://wvm.voxeloid.com/log/", "failed to get event log")
                }
            }
        })
    },
    841749: () => {
        if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
            document.getElementById("canvas").requestFullscreen()
        }
    },
    841875: () => {
        setTimeout(function() {
            _runTasksOnJSMainThread()
        }, 0)
    },
    841937: $0 => {
        window.putrequests[$0].abort();
        window.putrequests[$0] = {}
    },
    842002: $0 => {
        putrequests[$0] = {}
    },
    842028: ($0, $1, $2) => {
        var url = UTF8ToString($0);
        var data = FS.readFile(UTF8ToString($1), {});
        var request = new XMLHttpRequest;
        request.upload.addEventListener("progress", function(e) {
            _putrequestprogress($2, e.loaded, e.total)
        });
        request.upload.addEventListener("error", function(e) {
            console.log("PUT request error");
            console.log(event);
            _putrequestprogress($2, -1, -1)
        });
        request.open("put", url);
        request.timeout = 45e3;
        request.send(data);
        if ($2 == 0) {
            window.putrequests = {}
        }
        window.putrequests[$2] = request
    },
    842539: () => {
        return ptr = allocate(intArrayFromString(document.cookie), ALLOC_NORMAL)
    },
    842617: $0 => {
        document.cookie = "atoken=" + UTF8ToString($0)
    },
    842667: () => {
        return allocate(intArrayFromString(encodeURIComponent(document.referrer)), ALLOC_NORMAL)
    },
    842761: () => {
        if ("VideoDecoder" in window) return 1;
        return -1
    },
    842816: ($0, $1) => {
        FFmpegModule._createCLIFileHandle($0, $1, 0)
    },
    842865: () => {
        if (typeof AudioContext !== "undefined") {
            return true
        } else if (typeof webkitAudioContext !== "undefined") {
            return true
        }
        return false
    },
    843012: () => {
        if (typeof navigator.mediaDevices !== "undefined" && typeof navigator.mediaDevices.getUserMedia !== "undefined") {
            return true
        } else if (typeof navigator.webkitGetUserMedia !== "undefined") {
            return true
        }
        return false
    },
    843246: $0 => {
        if (typeof Module["SDL2"] === "undefined") {
            Module["SDL2"] = {}
        }
        var SDL2 = Module["SDL2"];
        if (!$0) {
            SDL2.audio = {}
        } else {
            SDL2.capture = {}
        }
        if (!SDL2.audioContext) {
            if (typeof AudioContext !== "undefined") {
                SDL2.audioContext = new AudioContext
            } else if (typeof webkitAudioContext !== "undefined") {
                SDL2.audioContext = new webkitAudioContext
            }
            if (SDL2.audioContext) {
                autoResumeAudioContext(SDL2.audioContext)
            }
        }
        return SDL2.audioContext === undefined ? -1 : 0
    },
    843739: () => {
        var SDL2 = Module["SDL2"];
        return SDL2.audioContext.sampleRate
    },
    843807: ($0, $1, $2, $3) => {
        var SDL2 = Module["SDL2"];
        var have_microphone = function(stream) {
            if (SDL2.capture.silenceTimer !== undefined) {
                clearTimeout(SDL2.capture.silenceTimer);
                SDL2.capture.silenceTimer = undefined
            }
            SDL2.capture.mediaStreamNode = SDL2.audioContext.createMediaStreamSource(stream);
            SDL2.capture.scriptProcessorNode = SDL2.audioContext.createScriptProcessor($1, $0, 1);
            SDL2.capture.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {
                if (SDL2 === undefined || SDL2.capture === undefined) {
                    return
                }
                audioProcessingEvent.outputBuffer.getChannelData(0).fill(0);
                SDL2.capture.currentCaptureBuffer = audioProcessingEvent.inputBuffer;
                dynCall("vi", $2, [$3])
            };
            SDL2.capture.mediaStreamNode.connect(SDL2.capture.scriptProcessorNode);
            SDL2.capture.scriptProcessorNode.connect(SDL2.audioContext.destination);
            SDL2.capture.stream = stream
        };
        var no_microphone = function(error) {};
        SDL2.capture.silenceBuffer = SDL2.audioContext.createBuffer($0, $1, SDL2.audioContext.sampleRate);
        SDL2.capture.silenceBuffer.getChannelData(0).fill(0);
        var silence_callback = function() {
            SDL2.capture.currentCaptureBuffer = SDL2.capture.silenceBuffer;
            dynCall("vi", $2, [$3])
        };
        SDL2.capture.silenceTimer = setTimeout(silence_callback, $1 / SDL2.audioContext.sampleRate * 1e3);
        if (navigator.mediaDevices !== undefined && navigator.mediaDevices.getUserMedia !== undefined) {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            }).then(have_microphone).catch(no_microphone)
        } else if (navigator.webkitGetUserMedia !== undefined) {
            navigator.webkitGetUserMedia({
                audio: true,
                video: false
            }, have_microphone, no_microphone)
        }
    },
    845459: ($0, $1, $2, $3) => {
        var SDL2 = Module["SDL2"];
        SDL2.audio.scriptProcessorNode = SDL2.audioContext["createScriptProcessor"]($1, 0, $0);
        SDL2.audio.scriptProcessorNode["onaudioprocess"] = function(e) {
            if (SDL2 === undefined || SDL2.audio === undefined) {
                return
            }
            SDL2.audio.currentOutputBuffer = e["outputBuffer"];
            dynCall("vi", $2, [$3])
        };
        SDL2.audio.scriptProcessorNode["connect"](SDL2.audioContext["destination"])
    },
    845869: ($0, $1) => {
        var SDL2 = Module["SDL2"];
        var numChannels = SDL2.capture.currentCaptureBuffer.numberOfChannels;
        for (var c = 0; c < numChannels; ++c) {
            var channelData = SDL2.capture.currentCaptureBuffer.getChannelData(c);
            if (channelData.length != $1) {
                throw "Web Audio capture buffer length mismatch! Destination size: " + channelData.length + " samples vs expected " + $1 + " samples!"
            }
            if (numChannels == 1) {
                for (var j = 0; j < $1; ++j) {
                    setValue($0 + j * 4, channelData[j], "float")
                }
            } else {
                for (var j = 0; j < $1; ++j) {
                    setValue($0 + (j * numChannels + c) * 4, channelData[j], "float")
                }
            }
        }
    },
    846474: ($0, $1) => {
        var SDL2 = Module["SDL2"];
        var numChannels = SDL2.audio.currentOutputBuffer["numberOfChannels"];
        for (var c = 0; c < numChannels; ++c) {
            var channelData = SDL2.audio.currentOutputBuffer["getChannelData"](c);
            if (channelData.length != $1) {
                throw "Web Audio output buffer length mismatch! Destination size: " + channelData.length + " samples vs expected " + $1 + " samples!"
            }
            for (var j = 0; j < $1; ++j) {
                channelData[j] = HEAPF32[$0 + (j * numChannels + c << 2) >>> 2]
            }
        }
    },
    846954: $0 => {
        var SDL2 = Module["SDL2"];
        if ($0) {
            if (SDL2.capture.silenceTimer !== undefined) {
                clearTimeout(SDL2.capture.silenceTimer)
            }
            if (SDL2.capture.stream !== undefined) {
                var tracks = SDL2.capture.stream.getAudioTracks();
                for (var i = 0; i < tracks.length; i++) {
                    SDL2.capture.stream.removeTrack(tracks[i])
                }
                SDL2.capture.stream = undefined
            }
            if (SDL2.capture.scriptProcessorNode !== undefined) {
                SDL2.capture.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {};
                SDL2.capture.scriptProcessorNode.disconnect();
                SDL2.capture.scriptProcessorNode = undefined
            }
            if (SDL2.capture.mediaStreamNode !== undefined) {
                SDL2.capture.mediaStreamNode.disconnect();
                SDL2.capture.mediaStreamNode = undefined
            }
            if (SDL2.capture.silenceBuffer !== undefined) {
                SDL2.capture.silenceBuffer = undefined
            }
            SDL2.capture = undefined
        } else {
            if (SDL2.audio.scriptProcessorNode != undefined) {
                SDL2.audio.scriptProcessorNode.disconnect();
                SDL2.audio.scriptProcessorNode = undefined
            }
            SDL2.audio = undefined
        }
        if (SDL2.audioContext !== undefined && SDL2.audio === undefined && SDL2.capture === undefined) {
            SDL2.audioContext.close();
            SDL2.audioContext = undefined
        }
    },
    848126: ($0, $1, $2) => {
        var w = $0;
        var h = $1;
        var pixels = $2;
        if (!Module["SDL2"]) Module["SDL2"] = {};
        var SDL2 = Module["SDL2"];
        if (SDL2.ctxCanvas !== Module["canvas"]) {
            SDL2.ctx = Module["createContext"](Module["canvas"], false, true);
            SDL2.ctxCanvas = Module["canvas"]
        }
        if (SDL2.w !== w || SDL2.h !== h || SDL2.imageCtx !== SDL2.ctx) {
            SDL2.image = SDL2.ctx.createImageData(w, h);
            SDL2.w = w;
            SDL2.h = h;
            SDL2.imageCtx = SDL2.ctx
        }
        var data = SDL2.image.data;
        var src = pixels >> 2;
        var dst = 0;
        var num;
        if (typeof CanvasPixelArray !== "undefined" && data instanceof CanvasPixelArray) {
            num = data.length;
            while (dst < num) {
                var val = HEAP32[src >>> 0];
                data[dst] = val & 255;
                data[dst + 1] = val >> 8 & 255;
                data[dst + 2] = val >> 16 & 255;
                data[dst + 3] = 255;
                src++;
                dst += 4
            }
        } else {
            if (SDL2.data32Data !== data) {
                SDL2.data32 = new Int32Array(data.buffer);
                SDL2.data8 = new Uint8Array(data.buffer);
                SDL2.data32Data = data
            }
            var data32 = SDL2.data32;
            num = data32.length;
            data32.set(HEAP32.subarray(src >>> 0, src + num >>> 0));
            var data8 = SDL2.data8;
            var i = 3;
            var j = i + 4 * num;
            if (num % 8 == 0) {
                while (i < j) {
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0;
                    data8[i] = 255;
                    i = i + 4 | 0
                }
            } else {
                while (i < j) {
                    data8[i] = 255;
                    i = i + 4 | 0
                }
            }
        }
        SDL2.ctx.putImageData(SDL2.image, 0, 0)
    },
    849595: ($0, $1, $2, $3, $4) => {
        var w = $0;
        var h = $1;
        var hot_x = $2;
        var hot_y = $3;
        var pixels = $4;
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        var image = ctx.createImageData(w, h);
        var data = image.data;
        var src = pixels >> 2;
        var dst = 0;
        var num;
        if (typeof CanvasPixelArray !== "undefined" && data instanceof CanvasPixelArray) {
            num = data.length;
            while (dst < num) {
                var val = HEAP32[src >>> 0];
                data[dst] = val & 255;
                data[dst + 1] = val >> 8 & 255;
                data[dst + 2] = val >> 16 & 255;
                data[dst + 3] = val >> 24 & 255;
                src++;
                dst += 4
            }
        } else {
            var data32 = new Int32Array(data.buffer);
            num = data32.length;
            data32.set(HEAP32.subarray(src >>> 0, src + num >>> 0))
        }
        ctx.putImageData(image, 0, 0);
        var url = hot_x === 0 && hot_y === 0 ? "url(" + canvas.toDataURL() + "), auto" : "url(" + canvas.toDataURL() + ") " + hot_x + " " + hot_y + ", auto";
        var urlBuf = _malloc(url.length + 1);
        stringToUTF8(url, urlBuf, url.length + 1);
        return urlBuf
    },
    850584: $0 => {
        if (Module["canvas"]) {
            Module["canvas"].style["cursor"] = UTF8ToString($0)
        }
    },
    850667: () => {
        if (Module["canvas"]) {
            Module["canvas"].style["cursor"] = "none"
        }
    },
    850736: () => {
        return window.innerWidth
    },
    850766: () => {
        return window.innerHeight
    }
};

function jsGetCanvasTargetWidth() {
    return window.innerWidth
}

function jsGetCanvasTargetHeight() {
    return window.innerHeight
}

function jsUseCursor(cursorName) {
    var cn = UTF8ToString(cursorName);
    document.getElementById("canvas").style.cursor = cn;
    var inp = document.getElementById("dummyinput");
    if (cn == "text") {
        if (inp) {
            inp.style.cursor = cn;
            inp.focus()
        }
        if (!Module.textCursor) {
            Module.textCursor = true;
            inp.style.left = event.clientX - 10 + "px";
            inp.style.top = event.clientY - 10 + "px"
        }
    } else {
        if (Module.textCursor) {
            Module.textCursor = false;
            if (inp) {
                inp.style.left = "-50px";
                inp.style.top = "-50px"
            }
        }
    }
}

function jsSetupMsgHandlers() {
    window.addEventListener("message", function(event) {
        console.log("received msg: ", event);
        if (event.data.cmd == "openfile") {
            console.log("openfile from msg");
            if ("file" in event.data.args) {
                var file = event.data.args.file;
                (async () => {
                    if (typeof window.openFileHandles === "undefined") {
                        window.openFileHandles = {};
                        window.openFiles = {}
                    }
                    let fid = _jsGetNextFileHandleID();
                    window.openFiles[fid] = file;
                    let fsize_lo = file.size & 268435455;
                    let fsize_hi = (file.size - fsize_lo) / 268435455;
                    var argname = allocate(intArrayFromString(file.name), ALLOC_NORMAL);
                    _jsReceiveDragAndDropFile(fid, fsize_lo, fsize_hi, argname, 0);
                    _free(argname)
                })()
            } else if ("buffer" in event.data.args) {
                (async () => {
                    let buffer = event.data.args.buffer;
                    FS.writeFile("/dnd-" + event.data.args["filename"], new Uint8Array(buffer));
                    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
                    var arg1 = allocate(intArrayFromString("/dnd-" + event.data.args["filename"]), ALLOC_NORMAL);
                    var arg2 = allocate(intArrayFromString(hashHex), ALLOC_NORMAL);
                    _jsReceiveDragAndDropFile(-1, -1, -1, arg1, arg2);
                    _free(arg1);
                    _free(arg2)
                })()
            }
        }
        if (event.data.cmd == "openforcaptioning" || event.data.cmd == "openmediafile") {
            if ("file" in event.data.args) {
                var file = event.data.args.file;
                (async () => {
                    if (typeof window.openFileHandles === "undefined") {
                        window.openFileHandles = {};
                        window.openFiles = {}
                    }
                    let fid = _jsGetNextFileHandleID();
                    window.openFiles[fid] = file;
                    let fsize_lo = file.size & 268435455;
                    let fsize_hi = (file.size - fsize_lo) / 268435455;
                    var argname = allocate(intArrayFromString(file.name), ALLOC_NORMAL);
                    _jsReceiveDragAndDropFile(fid, fsize_lo, fsize_hi, argname, 0);
                    _free(argname)
                })()
            } else if ("buffer" in event.data.args) {
                (async () => {
                    let buffer = event.data.args.buffer;
                    FS.writeFile("/dnd-" + event.data.args["filename"], new Uint8Array(buffer));
                    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
                    var arg1 = allocate(intArrayFromString("/dnd-" + event.data.args["filename"]), ALLOC_NORMAL);
                    var arg2 = allocate(intArrayFromString(hashHex), ALLOC_NORMAL);
                    if (event.data.cmd == "openforcaptioning") {
                        var arg3 = allocate(intArrayFromString(event.data.args.lang), ALLOC_NORMAL);
                        var arg4 = allocate(intArrayFromString(event.data.args.translate), ALLOC_NORMAL);
                        _openVideoFileForTranscription(arg1, arg2, arg3, arg4, event.data.reqID);
                        _free(arg3);
                        _free(arg4)
                    }
                    if (event.data.cmd == "openmediafile") {
                        _openMediaFile(arg1, arg2, event.data.reqID)
                    }
                    _free(arg1);
                    _free(arg2)
                })()
            }
        }
        if (event.data.cmd == "writeJSONToLayer") {
            let js = JSON.stringify(event.data.args.layer);
            var arg1 = allocate(intArrayFromString(js), ALLOC_NORMAL);
            _writeJSONToLayer(arg1, event.data.reqID);
            _free(arg1)
        }
        if (event.data.cmd == "readJSONFromLayer") {
            var arg1 = allocate(intArrayFromString(event.data.args.id), ALLOC_NORMAL);
            _readJSONFromLayer(arg1, event.data.reqID);
            _free(arg1)
        }
        if (event.data.cmd == "getAllLayers") {
            _embedded_getAllLayers(event.data.reqID)
        }
        if (event.data.cmd == "play") {
            _embedded_play()
        }
        if (event.data.cmd == "stop") {
            _embedded_stop()
        }
        if (event.data.cmd == "seek") {
            _embedded_seek(event.data.args.timestamp)
        }
        if (event.data.cmd == "opendialog") {
            _embedded_opendialog()
        }
        if (event.data.cmd == "export") {
            _embedded_export()
        }
    })
}

function jsFFmpegDecodeFrame(vidid, reqid, ts, ffOnWorker) {
    if (typeof ffmpegDoneVideoFrameDecodeCallback === "undefined") {
        ffmpegDoneVideoFrameDecodeCallback = function(decoderID, requestID, ts, fullbuff, ybuff, ubuff, vbuff, width, height) {
            if (!ffOnWorker) {
                var yarr = new Uint8Array(FFmpegModule.HEAPU8.buffer, ybuff, width * height);
                var uarr = new Uint8Array(FFmpegModule.HEAPU8.buffer, ubuff, width * height / 4);
                var varr = new Uint8Array(FFmpegModule.HEAPU8.buffer, vbuff, width * height / 4)
            } else {
                var yarr = new Uint8Array(window.Module.HEAPU8.buffer, ybuff, width * height);
                var uarr = new Uint8Array(window.Module.HEAPU8.buffer, ubuff, width * height / 4);
                var varr = new Uint8Array(window.Module.HEAPU8.buffer, vbuff, width * height / 4)
            }
            var ytex = _getNewGLTexture();
            var utex = _getNewGLTexture();
            var vtex = _getNewGLTexture();
            const level = 0;
            const border = 0;
            var internalFormat = gl.LUMINANCE;
            var srcFormat = gl.LUMINANCE;
            const srcType = gl.UNSIGNED_BYTE;
            if (width % 8 == 0) gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
            else gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            gl.bindTexture(gl.TEXTURE_2D, GL.textures[ytex]);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, yarr);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, GL.textures[utex]);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width / 2, height / 2, border, srcFormat, srcType, uarr);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            internalFormat = gl.ALPHA;
            srcFormat = gl.ALPHA;
            gl.bindTexture(gl.TEXTURE_2D, GL.textures[vtex]);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width / 2, height / 2, border, srcFormat, srcType, varr);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            if (!ffOnWorker) {
                FFmpegModule._free(fullbuff)
            } else {
                window.Module._free(fullbuff)
            }
            _ffPassDecodedFrame(decoderID, requestID, ts, ytex, utex, vtex, width, height)
        }
    }
    if (!ffOnWorker) {
        FFmpegModule._getFFVideoDecoderFrame(vidid, reqid, ts)
    } else {
        FFworker.postMessage({
            "cmd": "getFFVideoDecoderFrame",
            "args": {
                "vid": vidid,
                "reqid": reqid,
                "ts": ts
            }
        })
    }
}

function jsCreateWebcodecsAudioDecoder(prid) {
    let audioDecoder = new AudioDecoder({
        output: (preaderid => (function(frame) {
            audioDecoderInitState[preaderid] = 1;
            if (frame.buffer) {
                var samplesBuffer0 = frame.buffer.getChannelData(0);
                var ptr0 = Module._malloc(samplesBuffer0.length * samplesBuffer0.BYTES_PER_ELEMENT);
                Module.HEAPF32.set(samplesBuffer0, ptr0 / 4);
                var ptr1;
                var samplesBuffer1;
                if (frame.buffer.numberOfChannels > 1) {
                    samplesBuffer1 = frame.buffer.getChannelData(1);
                    ptr1 = Module._malloc(samplesBuffer1.length * samplesBuffer1.BYTES_PER_ELEMENT);
                    Module.HEAPF32.set(samplesBuffer1, ptr1 / 4)
                } else {
                    samplesBuffer1 = frame.buffer.getChannelData(0);
                    ptr1 = Module._malloc(samplesBuffer1.length * samplesBuffer1.BYTES_PER_ELEMENT);
                    Module.HEAPF32.set(samplesBuffer1, ptr1 / 4)
                }
                _jsPassWCAudio_f32(preaderid, frame.timestamp, -1, ptr0, ptr1, samplesBuffer0.length, samplesBuffer1.length, decodersByPRId[preaderid].decodeQueueSize == 0 ? 1 : 0);
                Module._free(ptr0);
                Module._free(ptr1)
            } else {
                var channelCount = frame.numberOfChannels;
                var samplesPerChannel = frame.numberOfFrames;
                var samplerate = frame.sampleRate;
                if (audioDecoderConfigsByPRId[prid].numberOfChannels == 1) channelCount = 1;
                if (frame.format == "f32-planar" || frame.format == "f32") {
                    let ptr0 = Module._malloc(samplesPerChannel * 4);
                    let ptr1 = Module._malloc(samplesPerChannel * 4);
                    let buf1 = new Float32Array(samplesPerChannel);
                    let buf2 = new Float32Array(samplesPerChannel);
                    var opts = {};
                    opts.format = "f32-planar";
                    opts.planeIndex = 0;
                    frame.copyTo(buf1, opts);
                    if (channelCount == 1) {
                        frame.copyTo(buf2, opts)
                    } else {
                        opts.planeIndex = 1;
                        frame.copyTo(buf2, opts)
                    }
                    if (typeof Module.GROWABLE_HEAP_F32 === "undefined") {
                        Module.HEAPF32.set(buf1, ptr0 / 4);
                        Module.HEAPF32.set(buf2, ptr1 / 4)
                    } else {
                        Module.GROWABLE_HEAP_F32().set(buf1, ptr0 / 4);
                        Module.GROWABLE_HEAP_F32().set(buf2, ptr1 / 4)
                    }
                    _jsPassWCAudio_f32(preaderid, 0, Math.round(frame.timestamp / 1e6 * samplerate), ptr0, ptr1, samplesPerChannel, samplesPerChannel, decodersByPRId[preaderid].decodeQueueSize == 0 ? 1 : 0);
                    Module._free(ptr0);
                    Module._free(ptr1)
                } else if (frame.format == "s16-planar") {
                    var ptr0 = Module._malloc(samplesPerChannel * 2);
                    var ptr1 = Module._malloc(samplesPerChannel * 2);
                    var buf1 = new Int16Array(samplesPerChannel);
                    var buf2 = new Int16Array(samplesPerChannel);
                    var opts = {};
                    opts.planeIndex = 0;
                    frame.copyTo(buf1, opts);
                    if (channelCount == 1) {
                        frame.copyTo(buf2, opts)
                    } else {
                        opts.planeIndex = 1;
                        frame.copyTo(buf2, opts)
                    }
                    Module.HEAP16.set(buf1, ptr0 / 2);
                    Module.HEAP16.set(buf2, ptr1 / 2);
                    _jsPassWCAudio_s16(preaderid, Math.round(frame.timestamp / 1e6 * samplerate), ptr0, ptr1, samplesPerChannel, samplesPerChannel, decodersByPRId[preaderid].decodeQueueSize == 0 ? 1 : 0);
                    Module._free(ptr0);
                    Module._free(ptr1)
                } else {
                    console.log("unsupported audiodata format!")
                }
            }
        }))(prid),
        error: (preaderid => (function(err) {
            if (err.name == "QuotaExceededError") {
                _jsHandleAudioDecoderClosedOutOfQuotaError(preaderid)
            } else {
                if (audioDecoderInitState[preaderid] == 0 && audioDecoderConfigsByPRId[preaderid].numberOfChannels < 3) {
                    audioDecoderConfigsByPRId[preaderid].numberOfChannels = 3 - audioDecoderConfigsByPRId[preaderid].numberOfChannels;
                    audioDecoderInitState[preaderid] = 2;
                    jsCreateWebcodecsAudioDecoder(preaderid)
                } else {
                    _jsHandleAudioDecoderOperationError(preaderid)
                }
            }
        }))(prid)
    });
    audioDecoder.configure(audioDecoderConfigsByPRId[prid]);
    decodersByPRId[prid] = audioDecoder
}

function jsSetupAudioJSCodec(prid, audioCodecStrPtr, audioextradataptr, audioextralen, ff_samplerate, ff_channelcount) {
    if (typeof decodersByPRId === "undefined") {
        decodersByPRId = {}
    }
    if (typeof audioDecoderConfigsByPRId === "undefined") {
        audioDecoderConfigsByPRId = {};
        audioDecoderInitState = {}
    }
    var audioCodecStr = UTF8ToString(audioCodecStrPtr);
    var audioextradata_shared = new Uint8Array(window.Module.HEAPU8.buffer, audioextradataptr, audioextralen);
    if (audioextralen == 2 && audioextradata_shared[0] == 18 && audioextradata_shared[1] == 8) {
        audioextradata_shared[1] = 16
    }
    var audioextradata_ab = new ArrayBuffer(audioextradata_shared.byteLength);
    var audioextradata = new Uint8Array(audioextradata_ab);
    audioextradata.set(audioextradata_shared);
    if (audioCodecStr.length == 0) return prid;
    var audioCfg = {
        codec: audioCodecStr,
        sampleRate: ff_samplerate,
        numberOfChannels: ff_channelcount,
        description: audioextradata
    };
    audioDecoderInitState[prid] = 0;
    audioDecoderConfigsByPRId[prid] = audioCfg;
    jsCreateWebcodecsAudioDecoder(prid);
    return prid
}

function jsSetupVideoJSCodec(prid, width, height, codecStrPtr, codecStrLen, extradataptr, extralen, firstVideoPTS) {
    if (typeof decodersByPRId === "undefined") {
        decodersByPRId = {}
    }
    if (typeof decoderConfigsByPRId === "undefined") {
        decoderConfigsByPRId = {}
    }
    if (typeof decodedFrames === "undefined") {
        decodedFrames = {}
    }
    var extradata_shared = new Uint8Array(window.Module.HEAPU8.buffer, extradataptr, extralen);
    var extradata_ab = new ArrayBuffer(extradata_shared.byteLength);
    var extradata = new Uint8Array(extradata_ab);
    extradata.set(extradata_shared);
    var codecStrArray = new Uint8Array(window.Module.HEAPU8.buffer, codecStrPtr, codecStrLen);
    var codecStr = "";
    for (let i = 0; i < codecStrLen; i++) {
        codecStr += String.fromCharCode(codecStrArray[i])
    }
    if (codecStr == "") return -1;
    var cfg = {
        "codec": codecStr,
        "codedHeight": height,
        "codedWidth": width
    };
    if (extralen > 0) {
        cfg["description"] = extradata
    }
    if (jsIsOldChrome()) cfg.hardwareAcceleration = "deny";
    let decoder = new VideoDecoder({
        output: ((preaderid, videoFirstPTS) => (function(frame) {
            if (frame.timestamp + videoFirstPTS in decodedFrames[preaderid]) {
                console.log("frame already exists!");
                decodedFrames[preaderid][frame.timestamp + videoFirstPTS].close()
            }
            decodedFrames[preaderid][frame.timestamp + videoFirstPTS] = frame;
            _webCodecsGotDecodedFrame(preaderid, frame.timestamp + videoFirstPTS)
        }))(prid, firstVideoPTS),
        error: (preaderid => (function(err) {
            console.log("video decode error: " + err.name);
            if (err.name == "QuotaExceededError") {
                _jsHandleVideoDecoderClosedOutOfQuotaError(preaderid)
            } else {
                _jsHandleVideoDecodeError(preaderid)
            }
        }))(prid)
    });
    decoderConfigsByPRId[prid] = cfg;
    decodersByPRId[prid] = decoder;
    decoder.configure(cfg);
    decodedFrames[prid] = {};
    return prid
}

function jsVideoSeekedFunc(vidid) {
    return function(time) {
        _jsVideoSeeked(vidid, videos[vidid].currentTime)
    }
}

function jsVideoCanPlayThroughFunc(vidid, iix) {
    return function(event) {
        _jsVideoLoaded(vidid, iix)
    }
}

function jsAddVideoInstance(vid, ix) {
    let vidid = vid;
    if (ix == 0) return;
    var k = vidid + "-" + ix;
    if (!(k in videos)) {
        videos[k] = document.createElement("video");
        videos[k].crossOrigin = "";
        videos[k].addEventListener("seeked", jsVideoSeekedFunc(k));
        videos[k].addEventListener("canplaythrough", jsVideoCanPlayThroughFunc(vidid, ix));
        videos[k].src = videos[vidid].src;
        videos[k].currentTime = 1;
        console.log("addVideoInstance " + vidid + "-" + ix + "   " + videos[k].src)
    }
}

function jsSeekVideo(vid, time) {
    if (typeof document !== "undefined") {
        videos[vid].currentTime = time
    }
}

function jsSeekVideo2(vid, chix, time) {
    if (typeof document !== "undefined") {
        videos[vid + "-" + chix].currentTime = time
    }
}

function jsGetVideoTexture2(vidid, channelIx, texid) {
    var fullvidid = vidid;
    if (channelIx != 0) fullvidid = vidid + "-" + channelIx;
    const level = 0;
    const internalFormat = gl.RGBA;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    gl.bindTexture(gl.TEXTURE_2D, GL.textures[texid]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, videos[fullvidid])
}

function createVideoForBlobFunc(vidid) {
    return function(blob) {
        videoBlobs[vidid] = blob;
        const bourl = window.URL.createObjectURL(blob);
        videoObjectUrls[vidid] = bourl;
        videos[lastVideoID] = document.createElement("video");
        videos[lastVideoID].crossOrigin = "";
        videos[lastVideoID].addEventListener("canplaythrough", jsVideoCanPlayThroughFunc(vidid, 0));
        videos[lastVideoID].addEventListener("seeked", jsVideoSeekedFunc(vidid));
        videos[lastVideoID].src = bourl;
        blob.arrayBuffer().then(buffer => {
            var audioContext = new(window.AudioContext || window.webkitAudioContext);
            audioContext.decodeAudioData(buffer).then(function(decodedAudioData) {
                var duration = decodedAudioData.duration;
                var offlineAudioContext = new OfflineAudioContext(2, 44100 * duration, 44100);
                var soundSource = offlineAudioContext.createBufferSource();
                myBuffer = decodedAudioData;
                soundSource.buffer = myBuffer;
                soundSource.connect(offlineAudioContext.destination);
                soundSource.start();
                offlineAudioContext.startRendering().then(function(renderedBuffer) {
                    var samplesBuffer0 = renderedBuffer.getChannelData(0);
                    var ptr0 = Module._malloc(samplesBuffer0.length * samplesBuffer0.BYTES_PER_ELEMENT);
                    Module.HEAPF32.set(samplesBuffer0, ptr0 / 4);
                    _jsPassVideoAudio(vidid, 0, ptr0, samplesBuffer0.length);
                    Module._free(ptr0);
                    var samplesBuffer1 = renderedBuffer.getChannelData(1);
                    var ptr1 = Module._malloc(samplesBuffer1.length * samplesBuffer1.BYTES_PER_ELEMENT);
                    Module.HEAPF32.set(samplesBuffer1, ptr1 / 4);
                    _jsPassVideoAudio(vidid, 1, ptr1, samplesBuffer1.length);
                    Module._free(ptr1)
                }).catch(function(err) {
                    console.log("Getting audio failed: " + err)
                })
            })
        })
    }
}

function jsCreateVideoForFilePath(urlStr) {
    let path = UTF8ToString(urlStr);
    lastVideoID = lastVideoID + 1;
    blob = FS.readFile(path);
    var cvf = createVideoForBlobFunc(lastVideoID);
    cvf(new Blob([blob], {
        type: "video/mp4"
    }));
    return lastVideoID
}

function jsCreateVideoForGUHandle(guFileID, startOffs, fileLen) {
    lastVideoID = lastVideoID + 1;
    (async (vid, fid, sof, flen) => {
        const slicebuff = await window.openFiles[fid].slice(sof, sof + flen).arrayBuffer();
        const blob = new Uint8Array(slicebuff);
        var cvf = createVideoForBlobFunc(vid);
        cvf(new Blob([blob], {
            type: "video/mp4"
        }))
    })(lastVideoID, guFileID, startOffs, fileLen);
    return lastVideoID
}

function jsFFmpegOpenForDecoding(vidid) {
    videoBlobs[vidid].arrayBuffer().then(buffer => {
        const data = new Uint8Array(buffer);
        var filename = "v" + vidid + ".mp4";
        FFmpegModule["FS_createDataFile"]("/", filename, data, true, true);
        var filename_str_ptr = FFmpegModule.allocate(FFmpegModule.intArrayFromString("/" + filename), FFmpegModule.ALLOC_NORMAL);
        FFmpegModule._startFFVideoDecoder(filename_str_ptr, vidid);
        FFmpegModule._free(filename_str_ptr)
    }).catch(e => {
        console.log("error opening videoblob")
    });
    return 0
}

function jsPlayVideo(vidid, chix) {
    if (chix == 0) videos[vidid].play();
    else videos[vidid + "-" + chix].play()
}

function jsStopVideo(vidid, chix) {
    if (chix == 0) videos[vidid].pause();
    else videos[vidid + "-" + chix].pause()
}

function jsGetVideoDuration(vid) {
    return videos[vid].duration
}

function jsGetVideoWidth(vid) {
    return videos[vid].videoWidth
}

function jsGetVideoHeight(vid) {
    return videos[vid].videoHeight
}

function jsCanAcceptVideoFrame() {
    return FFmpegModule._can_accept_videobuffer()
}

function jsCanAcceptAudioFrame() {
    return true
}

function jsGetDevicePixelRatio() {
    return window.devicePixelRatio || 1
}

function jsOpenURLInNewWindow(url) {
    window.open(UTF8ToString(url), "_blank")
}

function jsTextureWithEmoji(codepoint, pixbuff) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 128;
    canvas.height = 128;
    ctx.font = "128px Georgia";
    ctx.textAlign = "center";
    let emstr = String.fromCodePoint(codepoint);
    var fsize = 128;
    while (fsize > 32) {
        ctx.font = fsize + "px Georgia";
        if (ctx.measureText(emstr).width <= 128) {
            break
        } else {
            fsize -= 1
        }
    }
    ctx.fillText(emstr, 64, 64 + fsize * 3 / 8, 128);
    var imdata = ctx.getImageData(0, 0, 128, 128);
    var heapBytes = new Uint8Array(Module.HEAPU8.buffer, pixbuff, 128 * 128 * 4);
    heapBytes.set(new Uint8Array(imdata.data))
}

function jsCreateFileInput(extensions) {
    window.afileinput = document.createElement("input");
    window.afileinput.type = "file";
    window.afileinput.accept = UTF8ToString(extensions);
    window.afileinput.onchange = e => {
        if (window.afileinput.files.length == 0) return;
        var file = window.afileinput.files[0];
        var filename = window.afileinput.value;
        if (filename) {
            var backslash = String.fromCharCode(92);
            var startIndex = filename.indexOf(backslash) >= 0 ? filename.lastIndexOf(backslash) : filename.lastIndexOf("/");
            if (startIndex >= 0) filename = filename.substring(startIndex + 1)
        } else {
            filename = "unnamed"
        }
        var fr = new FileReader;
        fr.onload = async function() {
            var data = new Uint8Array(fr.result);
            const hashBuffer = await crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
            try {
                FS.unlink(filename)
            } catch (error) {}
            Module["FS_createDataFile"]("/", filename, data, true, true, true);
            var ptr = allocate(intArrayFromString(filename), ALLOC_NORMAL);
            var ptr2 = allocate(intArrayFromString(hashHex), ALLOC_NORMAL);
            _jsFileInputGotData(ptr, ptr2);
            _free(ptr);
            _free(ptr2);
            window.afileinput.value = ""
        };
        fr.readAsArrayBuffer(file)
    }
}

function jsShowOpenFileDialog() {
    window.afileinput.click()
}

function __asyncjs__readAsyncFromFileHandle(fhid, offs_h, offs_l, len, buff) {
    return Asyncify.handleAsync(async () => {
        let offs = offs_h * 268435456 + offs_l;
        const slicebuff = await window.openFiles[fhid].slice(offs, offs + len).arrayBuffer();
        const slicearr = new Uint8Array(slicebuff);
        Module.HEAPU8.set(slicearr, buff)
    })
}

function jsOfferFileToDownload(fname) {
    let content = FS.readFile(UTF8ToString(fname));
    FS.unlink(UTF8ToString(fname));
    let contentblob = new Blob([content], {
        type: "application/octet-stream"
    });
    var a = document.createElement("a");
    var fn = UTF8ToString(fname);
    if (fn.substring(0, 1) == "/") fn = fn.substring(1);
    a.download = fn;
    a.href = URL.createObjectURL(contentblob);
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href)
    }, 2e3)
}

function jsStoreTextToCopy(copiedtext) {
    window.texttocopy = UTF8ToString(copiedtext)
}

function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status
}

function listenOnce(object, event, func) {
    object.addEventListener(event, func, {
        "once": true
    })
}

function autoResumeAudioContext(ctx, elements) {
    if (!elements) {
        elements = [document, document.getElementById("canvas")]
    } ["keydown", "mousedown", "touchstart"].forEach(event => {
        elements.forEach(element => {
            if (element) {
                listenOnce(element, event, () => {
                    if (ctx.state === "suspended") ctx.resume()
                })
            }
        })
    })
}

function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        callbacks.shift()(Module)
    }
}

function dynCallLegacy(sig, ptr, args) {
    assert("dynCall_" + sig in Module, `bad function pointer type - dynCall function not found for sig '${sig}'`);
    if (args && args.length) {
        assert(args.length === sig.substring(1).replace(/j/g, "--").length)
    } else {
        assert(sig.length == 1)
    }
    var f = Module["dynCall_" + sig];
    return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr)
}
var wasmTableMirror = [];

function dynCall(sig, ptr, args) {
    return dynCallLegacy(sig, ptr, args)
}

function ptrToString(ptr) {
    assert(typeof ptr === "number");
    return "0x" + ptr.toString(16).padStart(8, "0")
}

function setValue(ptr, value, type = "i8") {
    if (type.endsWith("*")) type = "*";
    switch (type) {
        case "i1":
            HEAP8[ptr >>> 0] = value;
            break;
        case "i8":
            HEAP8[ptr >>> 0] = value;
            break;
        case "i16":
            HEAP16[ptr >>> 1] = value;
            break;
        case "i32":
            HEAP32[ptr >>> 2] = value;
            break;
        case "i64":
            tempI64 = [value >>> 0, (tempDouble = value, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >>> 2] = tempI64[0], HEAP32[ptr + 4 >>> 2] = tempI64[1];
            break;
        case "float":
            HEAPF32[ptr >>> 2] = value;
            break;
        case "double":
            HEAPF64[ptr >>> 3] = value;
            break;
        case "*":
            HEAPU32[ptr >>> 2] = value;
            break;
        default:
            abort("invalid type for setValue: " + type)
    }
}

function warnOnce(text) {
    if (!warnOnce.shown) warnOnce.shown = {};
    if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
        err(text)
    }
}

function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
    idx >>>= 0;
    var endIdx = idx + maxBytesToRead;
    var str = "";
    while (!(idx >= endIdx)) {
        var u0 = heapOrArray[idx++];
        if (!u0) return str;
        if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2
        } else {
            if ((u0 & 248) != 240) warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63
        }
        if (u0 < 65536) {
            str += String.fromCharCode(u0)
        } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
        }
    }
    return str
}

function UTF8ToString(ptr, maxBytesToRead) {
    assert(typeof ptr == "number");
    ptr >>>= 0;
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
}

function ___assert_fail(condition, filename, line, func) {
    abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"])
}

function ExceptionInfo(excPtr) {
    this.excPtr = excPtr;
    this.ptr = excPtr - 24;
    this.set_type = function(type) {
        HEAPU32[this.ptr + 4 >>> 2] = type
    };
    this.get_type = function() {
        return HEAPU32[this.ptr + 4 >>> 2]
    };
    this.set_destructor = function(destructor) {
        HEAPU32[this.ptr + 8 >>> 2] = destructor
    };
    this.get_destructor = function() {
        return HEAPU32[this.ptr + 8 >>> 2]
    };
    this.set_caught = function(caught) {
        caught = caught ? 1 : 0;
        HEAP8[this.ptr + 12 >>> 0] = caught
    };
    this.get_caught = function() {
        return HEAP8[this.ptr + 12 >>> 0] != 0
    };
    this.set_rethrown = function(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[this.ptr + 13 >>> 0] = rethrown
    };
    this.get_rethrown = function() {
        return HEAP8[this.ptr + 13 >>> 0] != 0
    };
    this.init = function(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor)
    };
    this.set_adjusted_ptr = function(adjustedPtr) {
        HEAPU32[this.ptr + 16 >>> 2] = adjustedPtr
    };
    this.get_adjusted_ptr = function() {
        return HEAPU32[this.ptr + 16 >>> 2]
    };
    this.get_exception_ptr = function() {
        var isPointer = ___cxa_is_pointer_type(this.get_type());
        if (isPointer) {
            return HEAPU32[this.excPtr >>> 2]
        }
        var adjusted = this.get_adjusted_ptr();
        if (adjusted !== 0) return adjusted;
        return this.excPtr
    }
}
var exceptionLast = 0;
var uncaughtExceptionCount = 0;

function ___cxa_throw(ptr, type, destructor) {
    var info = new ExceptionInfo(ptr);
    info.init(type, destructor);
    exceptionLast = ptr;
    uncaughtExceptionCount++;
    assert(false, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.")
}
var PATH = {
    isAbs: path => path.charAt(0) === "/",
    splitPath: filename => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1)
    },
    normalizeArray: (parts, allowAboveRoot) => {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
                parts.splice(i, 1)
            } else if (last === "..") {
                parts.splice(i, 1);
                up++
            } else if (up) {
                parts.splice(i, 1);
                up--
            }
        }
        if (allowAboveRoot) {
            for (; up; up--) {
                parts.unshift("..")
            }
        }
        return parts
    },
    normalize: path => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
        if (!path && !isAbsolute) {
            path = "."
        }
        if (path && trailingSlash) {
            path += "/"
        }
        return (isAbsolute ? "/" : "") + path
    },
    dirname: path => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
            return "."
        }
        if (dir) {
            dir = dir.substr(0, dir.length - 1)
        }
        return root + dir
    },
    basename: path => {
        if (path === "/") return "/";
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1)
    },
    join: function() {
        var paths = Array.prototype.slice.call(arguments);
        return PATH.normalize(paths.join("/"))
    },
    join2: (l, r) => {
        return PATH.normalize(l + "/" + r)
    }
};

function initRandomFill() {
    if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
        return view => crypto.getRandomValues(view)
    } else if (ENVIRONMENT_IS_NODE) {
        try {
            var crypto_module = require("crypto");
            var randomFillSync = crypto_module["randomFillSync"];
            if (randomFillSync) {
                return view => crypto_module["randomFillSync"](view)
            }
            var randomBytes = crypto_module["randomBytes"];
            return view => (view.set(randomBytes(view.byteLength)), view)
        } catch (e) {}
    }
    abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };")
}

function randomFill(view) {
    return (randomFill = initRandomFill())(view)
}
var PATH_FS = {
    resolve: function() {
        var resolvedPath = "",
            resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path != "string") {
                throw new TypeError("Arguments to path.resolve must be strings")
            } else if (!path) {
                return ""
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = PATH.isAbs(path)
        }
        resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
    },
    relative: (from, to) => {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);

        function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
                if (arr[start] !== "") break
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
                if (arr[end] !== "") break
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1)
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break
            }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..")
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/")
    }
};

function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i);
        if (c <= 127) {
            len++
        } else if (c <= 2047) {
            len += 2
        } else if (c >= 55296 && c <= 57343) {
            len += 4;
            ++i
        } else {
            len += 3
        }
    }
    return len
}

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    outIdx >>>= 0;
    assert(typeof str === "string");
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++ >>> 0] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++ >>> 0] = 192 | u >> 6;
            heap[outIdx++ >>> 0] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++ >>> 0] = 224 | u >> 12;
            heap[outIdx++ >>> 0] = 128 | u >> 6 & 63;
            heap[outIdx++ >>> 0] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            if (u > 1114111) warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
            heap[outIdx++ >>> 0] = 240 | u >> 18;
            heap[outIdx++ >>> 0] = 128 | u >> 12 & 63;
            heap[outIdx++ >>> 0] = 128 | u >> 6 & 63;
            heap[outIdx++ >>> 0] = 128 | u & 63
        }
    }
    heap[outIdx >>> 0] = 0;
    return outIdx - startIdx
}

function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array
}
var TTY = {
    ttys: [],
    init: function() {},
    shutdown: function() {},
    register: function(dev, ops) {
        TTY.ttys[dev] = {
            input: [],
            output: [],
            ops: ops
        };
        FS.registerDevice(dev, TTY.stream_ops)
    },
    stream_ops: {
        open: function(stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
                throw new FS.ErrnoError(43)
            }
            stream.tty = tty;
            stream.seekable = false
        },
        close: function(stream) {
            stream.tty.ops.fsync(stream.tty)
        },
        fsync: function(stream) {
            stream.tty.ops.fsync(stream.tty)
        },
        read: function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60)
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
                var result;
                try {
                    result = stream.tty.ops.get_char(stream.tty)
                } catch (e) {
                    throw new FS.ErrnoError(29)
                }
                if (result === undefined && bytesRead === 0) {
                    throw new FS.ErrnoError(6)
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result
            }
            if (bytesRead) {
                stream.node.timestamp = Date.now()
            }
            return bytesRead
        },
        write: function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60)
            }
            try {
                for (var i = 0; i < length; i++) {
                    stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                }
            } catch (e) {
                throw new FS.ErrnoError(29)
            }
            if (length) {
                stream.node.timestamp = Date.now()
            }
            return i
        }
    },
    default_tty_ops: {
        get_char: function(tty) {
            if (!tty.input.length) {
                var result = null;
                if (ENVIRONMENT_IS_NODE) {
                    var BUFSIZE = 256;
                    var buf = Buffer.alloc(BUFSIZE);
                    var bytesRead = 0;
                    try {
                        bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1)
                    } catch (e) {
                        if (e.toString().includes("EOF")) bytesRead = 0;
                        else throw e
                    }
                    if (bytesRead > 0) {
                        result = buf.slice(0, bytesRead).toString("utf-8")
                    } else {
                        result = null
                    }
                } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                    result = window.prompt("Input: ");
                    if (result !== null) {
                        result += "\n"
                    }
                } else if (typeof readline == "function") {
                    result = readline();
                    if (result !== null) {
                        result += "\n"
                    }
                }
                if (!result) {
                    return null
                }
                tty.input = intArrayFromString(result, true)
            }
            return tty.input.shift()
        },
        put_char: function(tty, val) {
            if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0) tty.output.push(val)
            }
        },
        fsync: function(tty) {
            if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        }
    },
    default_tty1_ops: {
        put_char: function(tty, val) {
            if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0) tty.output.push(val)
            }
        },
        fsync: function(tty) {
            if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        }
    }
};

function mmapAlloc(size) {
    abort("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported")
}
var MEMFS = {
    ops_table: null,
    mount: function(mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0)
    },
    createNode: function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(63)
        }
        if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
                dir: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        lookup: MEMFS.node_ops.lookup,
                        mknod: MEMFS.node_ops.mknod,
                        rename: MEMFS.node_ops.rename,
                        unlink: MEMFS.node_ops.unlink,
                        rmdir: MEMFS.node_ops.rmdir,
                        readdir: MEMFS.node_ops.readdir,
                        symlink: MEMFS.node_ops.symlink
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek
                    }
                },
                file: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek,
                        read: MEMFS.stream_ops.read,
                        write: MEMFS.stream_ops.write,
                        allocate: MEMFS.stream_ops.allocate,
                        mmap: MEMFS.stream_ops.mmap,
                        msync: MEMFS.stream_ops.msync
                    }
                },
                link: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        readlink: MEMFS.node_ops.readlink
                    },
                    stream: {}
                },
                chrdev: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: FS.chrdev_stream_ops
                }
            }
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {}
        } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null
        } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream
        } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream
        }
        node.timestamp = Date.now();
        if (parent) {
            parent.contents[name] = node;
            parent.timestamp = node.timestamp
        }
        return node
    },
    getFileDataAsTypedArray: function(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents)
    },
    expandFileStorage: function(node, newCapacity) {
        newCapacity >>>= 0;
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0)
    },
    resizeFileStorage: function(node, newSize) {
        newSize >>>= 0;
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0
        } else {
            var oldContents = node.contents;
            node.contents = new Uint8Array(newSize);
            if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
            }
            node.usedBytes = newSize
        }
    },
    node_ops: {
        getattr: function(node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
                attr.size = 4096
            } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes
            } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length
            } else {
                attr.size = 0
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr
        },
        setattr: function(node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp
            }
            if (attr.size !== undefined) {
                MEMFS.resizeFileStorage(node, attr.size)
            }
        },
        lookup: function(parent, name) {
            throw FS.genericErrors[44]
        },
        mknod: function(parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev)
        },
        rename: function(old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name)
                } catch (e) {}
                if (new_node) {
                    for (var i in new_node.contents) {
                        throw new FS.ErrnoError(55)
                    }
                }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.parent.timestamp = Date.now();
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            new_dir.timestamp = old_node.parent.timestamp;
            old_node.parent = new_dir
        },
        unlink: function(parent, name) {
            delete parent.contents[name];
            parent.timestamp = Date.now()
        },
        rmdir: function(parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
                throw new FS.ErrnoError(55)
            }
            delete parent.contents[name];
            parent.timestamp = Date.now()
        },
        readdir: function(node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue
                }
                entries.push(key)
            }
            return entries
        },
        symlink: function(parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node
        },
        readlink: function(node) {
            if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28)
            }
            return node.link
        }
    },
    stream_ops: {
        read: function(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            assert(size >= 0);
            if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset)
            } else {
                for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
            }
            return size
        },
        write: function(stream, buffer, offset, length, position, canOwn) {
            assert(!(buffer instanceof ArrayBuffer));
            if (buffer.buffer === HEAP8.buffer) {
                canOwn = false
            }
            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                    assert(position === 0, "canOwn must imply no weird position inside the file");
                    node.contents = buffer.subarray(offset, offset + length);
                    node.usedBytes = length;
                    return length
                } else if (node.usedBytes === 0 && position === 0) {
                    node.contents = buffer.slice(offset, offset + length);
                    node.usedBytes = length;
                    return length
                } else if (position + length <= node.usedBytes) {
                    node.contents.set(buffer.subarray(offset, offset + length), position);
                    return length
                }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray) {
                node.contents.set(buffer.subarray(offset, offset + length), position)
            } else {
                for (var i = 0; i < length; i++) {
                    node.contents[position + i] = buffer[offset + i]
                }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length
        },
        llseek: function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.usedBytes
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(28)
            }
            return position
        },
        allocate: function(stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
        },
        mmap: function(stream, length, position, prot, flags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43)
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
                allocated = false;
                ptr = contents.byteOffset
            } else {
                if (position > 0 || position + length < contents.length) {
                    if (contents.subarray) {
                        contents = contents.subarray(position, position + length)
                    } else {
                        contents = Array.prototype.slice.call(contents, position, position + length)
                    }
                }
                allocated = true;
                ptr = mmapAlloc(length);
                if (!ptr) {
                    throw new FS.ErrnoError(48)
                }
                ptr >>>= 0;
                HEAP8.set(contents, ptr >>> 0)
            }
            return {
                ptr: ptr,
                allocated: allocated
            }
        },
        msync: function(stream, buffer, offset, length, mmapFlags) {
            MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            return 0
        }
    }
};

function asyncLoad(url, onload, onerror, noRunDep) {
    var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
    readAsync(url, arrayBuffer => {
        assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
        onload(new Uint8Array(arrayBuffer));
        if (dep) removeRunDependency(dep)
    }, event => {
        if (onerror) {
            onerror()
        } else {
            throw `Loading data file "${url}" failed.`
        }
    });
    if (dep) addRunDependency(dep)
}
var preloadPlugins = Module["preloadPlugins"] || [];

function FS_handledByPreloadPlugin(byteArray, fullname, finish, onerror) {
    if (typeof Browser != "undefined") Browser.init();
    var handled = false;
    preloadPlugins.forEach(function(plugin) {
        if (handled) return;
        if (plugin["canHandle"](fullname)) {
            plugin["handle"](byteArray, fullname, finish, onerror);
            handled = true
        }
    });
    return handled
}

function FS_createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
    var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
    var dep = getUniqueRunDependency("cp " + fullname);

    function processData(byteArray) {
        function finish(byteArray) {
            if (preFinish) preFinish();
            if (!dontCreateFile) {
                FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
            }
            if (onload) onload();
            removeRunDependency(dep)
        }
        if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
                if (onerror) onerror();
                removeRunDependency(dep)
            })) {
            return
        }
        finish(byteArray)
    }
    addRunDependency(dep);
    if (typeof url == "string") {
        asyncLoad(url, byteArray => processData(byteArray), onerror)
    } else {
        processData(url)
    }
}

function FS_modeStringToFlags(str) {
    var flagModes = {
        "r": 0,
        "r+": 2,
        "w": 512 | 64 | 1,
        "w+": 512 | 64 | 2,
        "a": 1024 | 64 | 1,
        "a+": 1024 | 64 | 2
    };
    var flags = flagModes[str];
    if (typeof flags == "undefined") {
        throw new Error("Unknown file open mode: " + str)
    }
    return flags
}

function FS_getMode(canRead, canWrite) {
    var mode = 0;
    if (canRead) mode |= 292 | 73;
    if (canWrite) mode |= 146;
    return mode
}
var ERRNO_MESSAGES = {
    0: "Success",
    1: "Arg list too long",
    2: "Permission denied",
    3: "Address already in use",
    4: "Address not available",
    5: "Address family not supported by protocol family",
    6: "No more processes",
    7: "Socket already connected",
    8: "Bad file number",
    9: "Trying to read unreadable message",
    10: "Mount device busy",
    11: "Operation canceled",
    12: "No children",
    13: "Connection aborted",
    14: "Connection refused",
    15: "Connection reset by peer",
    16: "File locking deadlock error",
    17: "Destination address required",
    18: "Math arg out of domain of func",
    19: "Quota exceeded",
    20: "File exists",
    21: "Bad address",
    22: "File too large",
    23: "Host is unreachable",
    24: "Identifier removed",
    25: "Illegal byte sequence",
    26: "Connection already in progress",
    27: "Interrupted system call",
    28: "Invalid argument",
    29: "I/O error",
    30: "Socket is already connected",
    31: "Is a directory",
    32: "Too many symbolic links",
    33: "Too many open files",
    34: "Too many links",
    35: "Message too long",
    36: "Multihop attempted",
    37: "File or path name too long",
    38: "Network interface is not configured",
    39: "Connection reset by network",
    40: "Network is unreachable",
    41: "Too many open files in system",
    42: "No buffer space available",
    43: "No such device",
    44: "No such file or directory",
    45: "Exec format error",
    46: "No record locks available",
    47: "The link has been severed",
    48: "Not enough core",
    49: "No message of desired type",
    50: "Protocol not available",
    51: "No space left on device",
    52: "Function not implemented",
    53: "Socket is not connected",
    54: "Not a directory",
    55: "Directory not empty",
    56: "State not recoverable",
    57: "Socket operation on non-socket",
    59: "Not a typewriter",
    60: "No such device or address",
    61: "Value too large for defined data type",
    62: "Previous owner died",
    63: "Not super-user",
    64: "Broken pipe",
    65: "Protocol error",
    66: "Unknown protocol",
    67: "Protocol wrong type for socket",
    68: "Math result not representable",
    69: "Read only file system",
    70: "Illegal seek",
    71: "No such process",
    72: "Stale file handle",
    73: "Connection timed out",
    74: "Text file busy",
    75: "Cross-device link",
    100: "Device not a stream",
    101: "Bad font file fmt",
    102: "Invalid slot",
    103: "Invalid request code",
    104: "No anode",
    105: "Block device required",
    106: "Channel number out of range",
    107: "Level 3 halted",
    108: "Level 3 reset",
    109: "Link number out of range",
    110: "Protocol driver not attached",
    111: "No CSI structure available",
    112: "Level 2 halted",
    113: "Invalid exchange",
    114: "Invalid request descriptor",
    115: "Exchange full",
    116: "No data (for no delay io)",
    117: "Timer expired",
    118: "Out of streams resources",
    119: "Machine is not on the network",
    120: "Package not installed",
    121: "The object is remote",
    122: "Advertise error",
    123: "Srmount error",
    124: "Communication error on send",
    125: "Cross mount point (not really error)",
    126: "Given log. name not unique",
    127: "f.d. invalid for this operation",
    128: "Remote address changed",
    129: "Can   access a needed shared lib",
    130: "Accessing a corrupted shared lib",
    131: ".lib section in a.out corrupted",
    132: "Attempting to link in too many libs",
    133: "Attempting to exec a shared library",
    135: "Streams pipe error",
    136: "Too many users",
    137: "Socket type not supported",
    138: "Not supported",
    139: "Protocol family not supported",
    140: "Can't send after socket shutdown",
    141: "Too many references",
    142: "Host is down",
    148: "No medium (in tape drive)",
    156: "Level 2 not synchronized"
};
var ERRNO_CODES = {};

function demangle(func) {
    warnOnce("warning: build with -sDEMANGLE_SUPPORT to link in libcxxabi demangling");
    return func
}

function demangleAll(text) {
    var regex = /\b_Z[\w\d_]+/g;
    return text.replace(regex, function(x) {
        var y = demangle(x);
        return x === y ? x : y + " [" + x + "]"
    })
}
var FS = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    ErrnoError: null,
    genericErrors: {},
    filesystems: null,
    syncFSRequests: 0,
    lookupPath: (path, opts = {}) => {
        path = PATH_FS.resolve(path);
        if (!path) return {
            path: "",
            node: null
        };
        var defaults = {
            follow_mount: true,
            recurse_count: 0
        };
        opts = Object.assign(defaults, opts);
        if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(32)
        }
        var parts = path.split("/").filter(p => !!p);
        var current = FS.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
                break
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                    current = current.mounted.root
                }
            }
            if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                    var link = FS.readlink(current_path);
                    current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                    var lookup = FS.lookupPath(current_path, {
                        recurse_count: opts.recurse_count + 1
                    });
                    current = lookup.node;
                    if (count++ > 40) {
                        throw new FS.ErrnoError(32)
                    }
                }
            }
        }
        return {
            path: current_path,
            node: current
        }
    },
    getPath: node => {
        var path;
        while (true) {
            if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path) return mount;
                return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent
        }
    },
    hashName: (parentid, name) => {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0
        }
        return (parentid + hash >>> 0) % FS.nameTable.length
    },
    hashAddNode: node => {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node
    },
    hashRemoveNode: node => {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next
        } else {
            var current = FS.nameTable[hash];
            while (current) {
                if (current.name_next === node) {
                    current.name_next = node.name_next;
                    break
                }
                current = current.name_next
            }
        }
    },
    lookupNode: (parent, name) => {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
            throw new FS.ErrnoError(errCode, parent)
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
                return node
            }
        }
        return FS.lookup(parent, name)
    },
    createNode: (parent, name, mode, rdev) => {
        assert(typeof parent == "object");
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node
    },
    destroyNode: node => {
        FS.hashRemoveNode(node)
    },
    isRoot: node => {
        return node === node.parent
    },
    isMountpoint: node => {
        return !!node.mounted
    },
    isFile: mode => {
        return (mode & 61440) === 32768
    },
    isDir: mode => {
        return (mode & 61440) === 16384
    },
    isLink: mode => {
        return (mode & 61440) === 40960
    },
    isChrdev: mode => {
        return (mode & 61440) === 8192
    },
    isBlkdev: mode => {
        return (mode & 61440) === 24576
    },
    isFIFO: mode => {
        return (mode & 61440) === 4096
    },
    isSocket: mode => {
        return (mode & 49152) === 49152
    },
    flagsToPermissionString: flag => {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
            perms += "w"
        }
        return perms
    },
    nodePermissions: (node, perms) => {
        if (FS.ignorePermissions) {
            return 0
        }
        if (perms.includes("r") && !(node.mode & 292)) {
            return 2
        } else if (perms.includes("w") && !(node.mode & 146)) {
            return 2
        } else if (perms.includes("x") && !(node.mode & 73)) {
            return 2
        }
        return 0
    },
    mayLookup: dir => {
        var errCode = FS.nodePermissions(dir, "x");
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0
    },
    mayCreate: (dir, name) => {
        try {
            var node = FS.lookupNode(dir, name);
            return 20
        } catch (e) {}
        return FS.nodePermissions(dir, "wx")
    },
    mayDelete: (dir, name, isdir) => {
        var node;
        try {
            node = FS.lookupNode(dir, name)
        } catch (e) {
            return e.errno
        }
        var errCode = FS.nodePermissions(dir, "wx");
        if (errCode) {
            return errCode
        }
        if (isdir) {
            if (!FS.isDir(node.mode)) {
                return 54
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10
            }
        } else {
            if (FS.isDir(node.mode)) {
                return 31
            }
        }
        return 0
    },
    mayOpen: (node, flags) => {
        if (!node) {
            return 44
        }
        if (FS.isLink(node.mode)) {
            return 32
        } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return 31
            }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
    },
    MAX_OPEN_FDS: 4096,
    nextfd: (fd_start = 0, fd_end = FS.MAX_OPEN_FDS) => {
        for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
                return fd
            }
        }
        throw new FS.ErrnoError(33)
    },
    getStream: fd => FS.streams[fd],
    createStream: (stream, fd_start, fd_end) => {
        if (!FS.FSStream) {
            FS.FSStream = function() {
                this.shared = {}
            };
            FS.FSStream.prototype = {};
            Object.defineProperties(FS.FSStream.prototype, {
                object: {
                    get: function() {
                        return this.node
                    },
                    set: function(val) {
                        this.node = val
                    }
                },
                isRead: {
                    get: function() {
                        return (this.flags & 2097155) !== 1
                    }
                },
                isWrite: {
                    get: function() {
                        return (this.flags & 2097155) !== 0
                    }
                },
                isAppend: {
                    get: function() {
                        return this.flags & 1024
                    }
                },
                flags: {
                    get: function() {
                        return this.shared.flags
                    },
                    set: function(val) {
                        this.shared.flags = val
                    }
                },
                position: {
                    get: function() {
                        return this.shared.position
                    },
                    set: function(val) {
                        this.shared.position = val
                    }
                }
            })
        }
        stream = Object.assign(new FS.FSStream, stream);
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream
    },
    closeStream: fd => {
        FS.streams[fd] = null
    },
    chrdev_stream_ops: {
        open: stream => {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            if (stream.stream_ops.open) {
                stream.stream_ops.open(stream)
            }
        },
        llseek: () => {
            throw new FS.ErrnoError(70)
        }
    },
    major: dev => dev >> 8,
    minor: dev => dev & 255,
    makedev: (ma, mi) => ma << 8 | mi,
    registerDevice: (dev, ops) => {
        FS.devices[dev] = {
            stream_ops: ops
        }
    },
    getDevice: dev => FS.devices[dev],
    getMounts: mount => {
        var mounts = [];
        var check = [mount];
        while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts)
        }
        return mounts
    },
    syncfs: (populate, callback) => {
        if (typeof populate == "function") {
            callback = populate;
            populate = false
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
            err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;

        function doCallback(errCode) {
            assert(FS.syncFSRequests > 0);
            FS.syncFSRequests--;
            return callback(errCode)
        }

        function done(errCode) {
            if (errCode) {
                if (!done.errored) {
                    done.errored = true;
                    return doCallback(errCode)
                }
                return
            }
            if (++completed >= mounts.length) {
                doCallback(null)
            }
        }
        mounts.forEach(mount => {
            if (!mount.type.syncfs) {
                return done(null)
            }
            mount.type.syncfs(mount, populate, done)
        })
    },
    mount: (type, opts, mountpoint) => {
        if (typeof type == "string") {
            throw type
        }
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
            throw new FS.ErrnoError(10)
        } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
            });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10)
            }
            if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54)
            }
        }
        var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: []
        };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
            FS.root = mountRoot
        } else if (node) {
            node.mounted = mount;
            if (node.mount) {
                node.mount.mounts.push(mount)
            }
        }
        return mountRoot
    },
    unmount: mountpoint => {
        var lookup = FS.lookupPath(mountpoint, {
            follow_mount: false
        });
        if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28)
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach(hash => {
            var current = FS.nameTable[hash];
            while (current) {
                var next = current.name_next;
                if (mounts.includes(current.mount)) {
                    FS.destroyNode(current)
                }
                current = next
            }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1)
    },
    lookup: (parent, name) => {
        return parent.node_ops.lookup(parent, name)
    },
    mknod: (path, mode, dev) => {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(28)
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63)
        }
        return parent.node_ops.mknod(parent, name, mode, dev)
    },
    create: (path, mode) => {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0)
    },
    mkdir: (path, mode) => {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0)
    },
    mkdirTree: (path, mode) => {
        var dirs = path.split("/");
        var d = "";
        for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += "/" + dirs[i];
            try {
                FS.mkdir(d, mode)
            } catch (e) {
                if (e.errno != 20) throw e
            }
        }
    },
    mkdev: (path, mode, dev) => {
        if (typeof dev == "undefined") {
            dev = mode;
            mode = 438
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev)
    },
    symlink: (oldpath, newpath) => {
        if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44)
        }
        var lookup = FS.lookupPath(newpath, {
            parent: true
        });
        var parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(44)
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63)
        }
        return parent.node_ops.symlink(parent, newname, oldpath)
    },
    rename: (old_path, new_path) => {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        lookup = FS.lookupPath(old_path, {
            parent: true
        });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, {
            parent: true
        });
        new_dir = lookup.node;
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75)
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(28)
        }
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(55)
        }
        var new_node;
        try {
            new_node = FS.lookupNode(new_dir, new_name)
        } catch (e) {}
        if (old_node === new_node) {
            return
        }
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(10)
        }
        if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, "w");
            if (errCode) {
                throw new FS.ErrnoError(errCode)
            }
        }
        FS.hashRemoveNode(old_node);
        try {
            old_dir.node_ops.rename(old_node, new_dir, new_name)
        } catch (e) {
            throw e
        } finally {
            FS.hashAddNode(old_node)
        }
    },
    rmdir: path => {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node)
    },
    readdir: path => {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54)
        }
        return node.node_ops.readdir(node)
    },
    unlink: path => {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(44)
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node)
    },
    readlink: path => {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
            throw new FS.ErrnoError(44)
        }
        if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28)
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
    },
    stat: (path, dontFollow) => {
        var lookup = FS.lookupPath(path, {
            follow: !dontFollow
        });
        var node = lookup.node;
        if (!node) {
            throw new FS.ErrnoError(44)
        }
        if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63)
        }
        return node.node_ops.getattr(node)
    },
    lstat: path => {
        return FS.stat(path, true)
    },
    chmod: (path, mode, dontFollow) => {
        var node;
        if (typeof path == "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        node.node_ops.setattr(node, {
            mode: mode & 4095 | node.mode & ~4095,
            timestamp: Date.now()
        })
    },
    lchmod: (path, mode) => {
        FS.chmod(path, mode, true)
    },
    fchmod: (fd, mode) => {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        FS.chmod(stream.node, mode)
    },
    chown: (path, uid, gid, dontFollow) => {
        var node;
        if (typeof path == "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        node.node_ops.setattr(node, {
            timestamp: Date.now()
        })
    },
    lchown: (path, uid, gid) => {
        FS.chown(path, uid, gid, true)
    },
    fchown: (fd, uid, gid) => {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        FS.chown(stream.node, uid, gid)
    },
    truncate: (path, len) => {
        if (len < 0) {
            throw new FS.ErrnoError(28)
        }
        var node;
        if (typeof path == "string") {
            var lookup = FS.lookupPath(path, {
                follow: true
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28)
        }
        var errCode = FS.nodePermissions(node, "w");
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
        })
    },
    ftruncate: (fd, len) => {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28)
        }
        FS.truncate(stream.node, len)
    },
    utime: (path, atime, mtime) => {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
        })
    },
    open: (path, flags, mode) => {
        if (path === "") {
            throw new FS.ErrnoError(44)
        }
        flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
        mode = typeof mode == "undefined" ? 438 : mode;
        if (flags & 64) {
            mode = mode & 4095 | 32768
        } else {
            mode = 0
        }
        var node;
        if (typeof path == "object") {
            node = path
        } else {
            path = PATH.normalize(path);
            try {
                var lookup = FS.lookupPath(path, {
                    follow: !(flags & 131072)
                });
                node = lookup.node
            } catch (e) {}
        }
        var created = false;
        if (flags & 64) {
            if (node) {
                if (flags & 128) {
                    throw new FS.ErrnoError(20)
                }
            } else {
                node = FS.mknod(path, mode, 0);
                created = true
            }
        }
        if (!node) {
            throw new FS.ErrnoError(44)
        }
        if (FS.isChrdev(node.mode)) {
            flags &= ~512
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54)
        }
        if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
                throw new FS.ErrnoError(errCode)
            }
        }
        if (flags & 512 && !created) {
            FS.truncate(node, 0)
        }
        flags &= ~(128 | 512 | 131072);
        var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            ungotten: [],
            error: false
        });
        if (stream.stream_ops.open) {
            stream.stream_ops.open(stream)
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1
            }
        }
        return stream
    },
    close: stream => {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (stream.getdents) stream.getdents = null;
        try {
            if (stream.stream_ops.close) {
                stream.stream_ops.close(stream)
            }
        } catch (e) {
            throw e
        } finally {
            FS.closeStream(stream.fd)
        }
        stream.fd = null
    },
    isClosed: stream => {
        return stream.fd === null
    },
    llseek: (stream, offset, whence) => {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70)
        }
        if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28)
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position
    },
    read: (stream, buffer, offset, length, position) => {
        offset >>>= 0;
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28)
        }
        var seeking = typeof position != "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead
    },
    write: (stream, buffer, offset, length, position, canOwn) => {
        offset >>>= 0;
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28)
        }
        if (stream.seekable && stream.flags & 1024) {
            FS.llseek(stream, 0, 2)
        }
        var seeking = typeof position != "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten
    },
    allocate: (stream, offset, length) => {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43)
        }
        if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138)
        }
        stream.stream_ops.allocate(stream, offset, length)
    },
    mmap: (stream, length, position, prot, flags) => {
        if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2)
        }
        if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43)
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags)
    },
    msync: (stream, buffer, offset, length, mmapFlags) => {
        offset >>>= 0;
        if (!stream.stream_ops.msync) {
            return 0
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
    },
    munmap: stream => 0,
    ioctl: (stream, cmd, arg) => {
        if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59)
        }
        return stream.stream_ops.ioctl(stream, cmd, arg)
    },
    readFile: (path, opts = {}) => {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"')
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0)
        } else if (opts.encoding === "binary") {
            ret = buf
        }
        FS.close(stream);
        return ret
    },
    writeFile: (path, data, opts = {}) => {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
        } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
        } else {
            throw new Error("Unsupported data type")
        }
        FS.close(stream)
    },
    cwd: () => FS.currentPath,
    chdir: path => {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        if (lookup.node === null) {
            throw new FS.ErrnoError(44)
        }
        if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54)
        }
        var errCode = FS.nodePermissions(lookup.node, "x");
        if (errCode) {
            throw new FS.ErrnoError(errCode)
        }
        FS.currentPath = lookup.path
    },
    createDefaultDirectories: () => {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user")
    },
    createDefaultDevices: () => {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
            read: () => 0,
            write: (stream, buffer, offset, length, pos) => length
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var randomBuffer = new Uint8Array(1024),
            randomLeft = 0;
        var randomByte = () => {
            if (randomLeft === 0) {
                randomLeft = randomFill(randomBuffer).byteLength
            }
            return randomBuffer[--randomLeft]
        };
        FS.createDevice("/dev", "random", randomByte);
        FS.createDevice("/dev", "urandom", randomByte);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp")
    },
    createSpecialDirectories: () => {
        FS.mkdir("/proc");
        var proc_self = FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount({
            mount: () => {
                var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
                node.node_ops = {
                    lookup: (parent, name) => {
                        var fd = +name;
                        var stream = FS.getStream(fd);
                        if (!stream) throw new FS.ErrnoError(8);
                        var ret = {
                            parent: null,
                            mount: {
                                mountpoint: "fake"
                            },
                            node_ops: {
                                readlink: () => stream.path
                            }
                        };
                        ret.parent = ret;
                        return ret
                    }
                };
                return node
            }
        }, {}, "/proc/self/fd")
    },
    createStandardStreams: () => {
        if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdin")
        }
        if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdout")
        }
        if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"])
        } else {
            FS.symlink("/dev/tty1", "/dev/stderr")
        }
        var stdin = FS.open("/dev/stdin", 0);
        var stdout = FS.open("/dev/stdout", 1);
        var stderr = FS.open("/dev/stderr", 1);
        assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
        assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
        assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")")
    },
    ensureErrnoError: () => {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
            this.name = "ErrnoError";
            this.node = node;
            this.setErrno = function(errno) {
                this.errno = errno;
                for (var key in ERRNO_CODES) {
                    if (ERRNO_CODES[key] === errno) {
                        this.code = key;
                        break
                    }
                }
            };
            this.setErrno(errno);
            this.message = ERRNO_MESSAGES[errno];
            if (this.stack) {
                Object.defineProperty(this, "stack", {
                    value: (new Error).stack,
                    writable: true
                });
                this.stack = demangleAll(this.stack)
            }
        };
        FS.ErrnoError.prototype = new Error;
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [44].forEach(code => {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>"
        })
    },
    staticInit: () => {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = {
            "MEMFS": MEMFS
        }
    },
    init: (input, output, error) => {
        assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module["stdin"] = input || Module["stdin"];
        Module["stdout"] = output || Module["stdout"];
        Module["stderr"] = error || Module["stderr"];
        FS.createStandardStreams()
    },
    quit: () => {
        FS.init.initialized = false;
        _fflush(0);
        for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
                continue
            }
            FS.close(stream)
        }
    },
    findObject: (path, dontResolveLastLink) => {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
            return null
        }
        return ret.object
    },
    analyzePath: (path, dontResolveLastLink) => {
        try {
            var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            path = lookup.path
        } catch (e) {}
        var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
        };
        try {
            var lookup = FS.lookupPath(path, {
                parent: true
            });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/"
        } catch (e) {
            ret.error = e.errno
        }
        return ret
    },
    createPath: (parent, path, canRead, canWrite) => {
        parent = typeof parent == "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
                FS.mkdir(current)
            } catch (e) {}
            parent = current
        }
        return current
    },
    createFile: (parent, name, properties, canRead, canWrite) => {
        var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(canRead, canWrite);
        return FS.create(path, mode)
    },
    createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
        var path = name;
        if (parent) {
            parent = typeof parent == "string" ? parent : FS.getPath(parent);
            path = name ? PATH.join2(parent, name) : parent
        }
        var mode = FS_getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
            if (typeof data == "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
                data = arr
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 577);
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode)
        }
        return node
    },
    createDevice: (parent, name, input, output) => {
        var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
            open: stream => {
                stream.seekable = false
            },
            close: stream => {
                if (output && output.buffer && output.buffer.length) {
                    output(10)
                }
            },
            read: (stream, buffer, offset, length, pos) => {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = input()
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6)
                    }
                    if (result === null || result === undefined) break;
                    bytesRead++;
                    buffer[offset + i] = result
                }
                if (bytesRead) {
                    stream.node.timestamp = Date.now()
                }
                return bytesRead
            },
            write: (stream, buffer, offset, length, pos) => {
                for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i])
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                }
                if (length) {
                    stream.node.timestamp = Date.now()
                }
                return i
            }
        });
        return FS.mkdev(path, mode, dev)
    },
    forceLoadFile: obj => {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (typeof XMLHttpRequest != "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
        } else if (read_) {
            try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length
            } catch (e) {
                throw new FS.ErrnoError(29)
            }
        } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.")
        }
    },
    createLazyFile: (parent, name, url, canRead, canWrite) => {
        function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
                return undefined
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset]
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest;
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = (from, to) => {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                xhr.responseType = "arraybuffer";
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined")
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                    return new Uint8Array(xhr.response || [])
                }
                return intArrayFromString(xhr.responseText || "", true)
            };
            var lazyArray = this;
            lazyArray.setDataGetter(chunkNum => {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray.chunks[chunkNum] == "undefined") {
                    lazyArray.chunks[chunkNum] = doXHR(start, end)
                }
                if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum]
            });
            if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out("LazyFiles on gzip forces download of the whole file when length is accessed")
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true
        };
        if (typeof XMLHttpRequest != "undefined") {
            if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array;
            Object.defineProperties(lazyArray, {
                length: {
                    get: function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._length
                    }
                },
                chunkSize: {
                    get: function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._chunkSize
                    }
                }
            });
            var properties = {
                isDevice: false,
                contents: lazyArray
            }
        } else {
            var properties = {
                isDevice: false,
                url: url
            }
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
            node.contents = properties.contents
        } else if (properties.url) {
            node.contents = null;
            node.url = properties.url
        }
        Object.defineProperties(node, {
            usedBytes: {
                get: function() {
                    return this.contents.length
                }
            }
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(key => {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
                FS.forceLoadFile(node);
                return fn.apply(null, arguments)
            }
        });

        function writeChunks(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if (contents.slice) {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i]
                }
            } else {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i)
                }
            }
            return size
        }
        stream_ops.read = (stream, buffer, offset, length, position) => {
            FS.forceLoadFile(node);
            return writeChunks(stream, buffer, offset, length, position)
        };
        stream_ops.mmap = (stream, length, position, prot, flags) => {
            FS.forceLoadFile(node);
            var ptr = mmapAlloc(length);
            if (!ptr) {
                throw new FS.ErrnoError(48)
            }
            writeChunks(stream, HEAP8, ptr, length, position);
            return {
                ptr: ptr,
                allocated: true
            }
        };
        node.stream_ops = stream_ops;
        return node
    },
    absolutePath: () => {
        abort("FS.absolutePath has been removed; use PATH_FS.resolve instead")
    },
    createFolder: () => {
        abort("FS.createFolder has been removed; use FS.mkdir instead")
    },
    createLink: () => {
        abort("FS.createLink has been removed; use FS.symlink instead")
    },
    joinPath: () => {
        abort("FS.joinPath has been removed; use PATH.join instead")
    },
    mmapAlloc: () => {
        abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc")
    },
    standardizePath: () => {
        abort("FS.standardizePath has been removed; use PATH.normalize instead")
    }
};
var SYSCALLS = {
    DEFAULT_POLLMASK: 5,
    calculateAt: function(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
            return path
        }
        var dir;
        if (dirfd === -100) {
            dir = FS.cwd()
        } else {
            var dirstream = SYSCALLS.getStreamFromFD(dirfd);
            dir = dirstream.path
        }
        if (path.length == 0) {
            if (!allowEmpty) {
                throw new FS.ErrnoError(44)
            }
            return dir
        }
        return PATH.join2(dir, path)
    },
    doStat: function(func, path, buf) {
        try {
            var stat = func(path)
        } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                return -54
            }
            throw e
        }
        HEAP32[buf >>> 2] = stat.dev;
        HEAP32[buf + 8 >>> 2] = stat.ino;
        HEAP32[buf + 12 >>> 2] = stat.mode;
        HEAPU32[buf + 16 >>> 2] = stat.nlink;
        HEAP32[buf + 20 >>> 2] = stat.uid;
        HEAP32[buf + 24 >>> 2] = stat.gid;
        HEAP32[buf + 28 >>> 2] = stat.rdev;
        tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >>> 2] = tempI64[0], HEAP32[buf + 44 >>> 2] = tempI64[1];
        HEAP32[buf + 48 >>> 2] = 4096;
        HEAP32[buf + 52 >>> 2] = stat.blocks;
        var atime = stat.atime.getTime();
        var mtime = stat.mtime.getTime();
        var ctime = stat.ctime.getTime();
        tempI64 = [Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 56 >>> 2] = tempI64[0], HEAP32[buf + 60 >>> 2] = tempI64[1];
        HEAPU32[buf + 64 >>> 2] = atime % 1e3 * 1e3;
        tempI64 = [Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 72 >>> 2] = tempI64[0], HEAP32[buf + 76 >>> 2] = tempI64[1];
        HEAPU32[buf + 80 >>> 2] = mtime % 1e3 * 1e3;
        tempI64 = [Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 88 >>> 2] = tempI64[0], HEAP32[buf + 92 >>> 2] = tempI64[1];
        HEAPU32[buf + 96 >>> 2] = ctime % 1e3 * 1e3;
        tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 104 >>> 2] = tempI64[0], HEAP32[buf + 108 >>> 2] = tempI64[1];
        return 0
    },
    doMsync: function(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43)
        }
        if (flags & 2) {
            return 0
        }
        addr >>>= 0;
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags)
    },
    varargs: undefined,
    get: function() {
        assert(SYSCALLS.varargs != undefined);
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >>> 2];
        return ret
    },
    getStr: function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret
    },
    getStreamFromFD: function(fd) {
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream
    }
};

function ___syscall_faccessat(dirfd, path, amode, flags) {
    try {
        path = SYSCALLS.getStr(path);
        assert(flags === 0);
        path = SYSCALLS.calculateAt(dirfd, path);
        if (amode & ~7) {
            return -28
        }
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        if (!node) {
            return -44
        }
        var perms = "";
        if (amode & 4) perms += "r";
        if (amode & 2) perms += "w";
        if (amode & 1) perms += "x";
        if (perms && FS.nodePermissions(node, perms)) {
            return -2
        }
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function setErrNo(value) {
    HEAP32[___errno_location() >>> 2] = value;
    return value
}

function ___syscall_fcntl64(fd, cmd, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (cmd) {
            case 0: {
                var arg = SYSCALLS.get();
                if (arg < 0) {
                    return -28
                }
                var newStream;
                newStream = FS.createStream(stream, arg);
                return newStream.fd
            }
            case 1:
            case 2:
                return 0;
            case 3:
                return stream.flags;
            case 4: {
                var arg = SYSCALLS.get();
                stream.flags |= arg;
                return 0
            }
            case 5: {
                var arg = SYSCALLS.get();
                var offset = 0;
                HEAP16[arg + offset >>> 1] = 2;
                return 0
            }
            case 6:
            case 7:
                return 0;
            case 16:
            case 8:
                return -28;
            case 9:
                setErrNo(28);
                return -1;
            default: {
                return -28
            }
        }
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_fstat64(fd, buf) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        return SYSCALLS.doStat(FS.stat, stream.path, buf)
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function stringToUTF8(str, outPtr, maxBytesToWrite) {
    assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
}

function ___syscall_getdents64(fd, dirp, count) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (!stream.getdents) {
            stream.getdents = FS.readdir(stream.path)
        }
        var struct_size = 280;
        var pos = 0;
        var off = FS.llseek(stream, 0, 1);
        var idx = Math.floor(off / struct_size);
        while (idx < stream.getdents.length && pos + struct_size <= count) {
            var id;
            var type;
            var name = stream.getdents[idx];
            if (name === ".") {
                id = stream.node.id;
                type = 4
            } else if (name === "..") {
                var lookup = FS.lookupPath(stream.path, {
                    parent: true
                });
                id = lookup.node.id;
                type = 4
            } else {
                var child = FS.lookupNode(stream.node, name);
                id = child.id;
                type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8
            }
            assert(id);
            tempI64 = [id >>> 0, (tempDouble = id, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos >>> 2] = tempI64[0], HEAP32[dirp + pos + 4 >>> 2] = tempI64[1];
            tempI64 = [(idx + 1) * struct_size >>> 0, (tempDouble = (idx + 1) * struct_size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos + 8 >>> 2] = tempI64[0], HEAP32[dirp + pos + 12 >>> 2] = tempI64[1];
            HEAP16[dirp + pos + 16 >>> 1] = 280;
            HEAP8[dirp + pos + 18 >>> 0] = type;
            stringToUTF8(name, dirp + pos + 19, 256);
            pos += struct_size;
            idx += 1
        }
        FS.llseek(stream, idx * struct_size, 0);
        return pos
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_ioctl(fd, op, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        switch (op) {
            case 21509:
            case 21505: {
                if (!stream.tty) return -59;
                return 0
            }
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508: {
                if (!stream.tty) return -59;
                return 0
            }
            case 21519: {
                if (!stream.tty) return -59;
                var argp = SYSCALLS.get();
                HEAP32[argp >>> 2] = 0;
                return 0
            }
            case 21520: {
                if (!stream.tty) return -59;
                return -28
            }
            case 21531: {
                var argp = SYSCALLS.get();
                return FS.ioctl(stream, op, argp)
            }
            case 21523: {
                if (!stream.tty) return -59;
                return 0
            }
            case 21524: {
                if (!stream.tty) return -59;
                return 0
            }
            default:
                return -28
        }
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_lstat64(path, buf) {
    try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.lstat, path, buf)
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_mkdirat(dirfd, path, mode) {
    try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        path = PATH.normalize(path);
        if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
        FS.mkdir(path, mode, 0);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_newfstatat(dirfd, path, buf, flags) {
    try {
        path = SYSCALLS.getStr(path);
        var nofollow = flags & 256;
        var allowEmpty = flags & 4096;
        flags = flags & ~6400;
        assert(!flags, "unknown flags in __syscall_newfstatat: " + flags);
        path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
        return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf)
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_openat(dirfd, path, flags, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        var mode = varargs ? SYSCALLS.get() : 0;
        return FS.open(path, flags, mode).fd
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
    try {
        oldpath = SYSCALLS.getStr(oldpath);
        newpath = SYSCALLS.getStr(newpath);
        oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
        newpath = SYSCALLS.calculateAt(newdirfd, newpath);
        FS.rename(oldpath, newpath);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_rmdir(path) {
    try {
        path = SYSCALLS.getStr(path);
        FS.rmdir(path);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_stat64(path, buf) {
    try {
        path = SYSCALLS.getStr(path);
        return SYSCALLS.doStat(FS.stat, path, buf)
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_symlink(target, linkpath) {
    try {
        target = SYSCALLS.getStr(target);
        linkpath = SYSCALLS.getStr(linkpath);
        FS.symlink(target, linkpath);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function ___syscall_unlinkat(dirfd, path, flags) {
    try {
        path = SYSCALLS.getStr(path);
        path = SYSCALLS.calculateAt(dirfd, path);
        if (flags === 0) {
            FS.unlink(path)
        } else if (flags === 512) {
            FS.rmdir(path)
        } else {
            abort("Invalid flags passed to unlinkat")
        }
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return -e.errno
    }
}

function __emscripten_fetch_free(id) {
    var xhr = Fetch.xhrs[id];
    if (xhr) {
        delete Fetch.xhrs[id];
        if (xhr.readyState > 0 && xhr.readyState < 4) {
            xhr.abort()
        }
    }
}
var nowIsMonotonic = true;

function __emscripten_get_now_is_monotonic() {
    return nowIsMonotonic
}

function __emscripten_throw_longjmp() {
    throw Infinity
}

function _abort() {
    abort("native code called abort()")
}

function _emscripten_set_main_loop_timing(mode, value) {
    Browser.mainLoop.timingMode = mode;
    Browser.mainLoop.timingValue = value;
    if (!Browser.mainLoop.func) {
        err("emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.");
        return 1
    }
    if (!Browser.mainLoop.running) {
        Browser.mainLoop.running = true
    }
    if (mode == 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
            var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
            setTimeout(Browser.mainLoop.runner, timeUntilNextTick)
        };
        Browser.mainLoop.method = "timeout"
    } else if (mode == 1) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
            Browser.requestAnimationFrame(Browser.mainLoop.runner)
        };
        Browser.mainLoop.method = "rAF"
    } else if (mode == 2) {
        if (typeof setImmediate == "undefined") {
            var setImmediates = [];
            var emscriptenMainLoopMessageId = "setimmediate";
            var Browser_setImmediate_messageHandler = event => {
                if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                    event.stopPropagation();
                    setImmediates.shift()()
                }
            };
            addEventListener("message", Browser_setImmediate_messageHandler, true);
            setImmediate = function Browser_emulated_setImmediate(func) {
                setImmediates.push(func);
                if (ENVIRONMENT_IS_WORKER) {
                    if (Module["setImmediates"] === undefined) Module["setImmediates"] = [];
                    Module["setImmediates"].push(func);
                    postMessage({
                        target: emscriptenMainLoopMessageId
                    })
                } else postMessage(emscriptenMainLoopMessageId, "*")
            }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
            setImmediate(Browser.mainLoop.runner)
        };
        Browser.mainLoop.method = "immediate"
    }
    return 0
}
var _emscripten_get_now;
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = () => {
        var t = process.hrtime();
        return t[0] * 1e3 + t[1] / 1e6
    }
} else _emscripten_get_now = () => performance.now();

function setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop, arg, noSetTiming) {
    assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
    Browser.mainLoop.func = browserIterationFunc;
    Browser.mainLoop.arg = arg;
    var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;

    function checkIsRunning() {
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {
            return false
        }
        return true
    }
    Browser.mainLoop.running = false;
    Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
            var start = Date.now();
            var blocker = Browser.mainLoop.queue.shift();
            blocker.func(blocker.arg);
            if (Browser.mainLoop.remainingBlockers) {
                var remaining = Browser.mainLoop.remainingBlockers;
                var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
                if (blocker.counted) {
                    Browser.mainLoop.remainingBlockers = next
                } else {
                    next = next + .5;
                    Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9
                }
            }
            out('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
            Browser.mainLoop.updateStatus();
            if (!checkIsRunning()) return;
            setTimeout(Browser.mainLoop.runner, 0);
            return
        }
        if (!checkIsRunning()) return;
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
            Browser.mainLoop.scheduler();
            return
        } else if (Browser.mainLoop.timingMode == 0) {
            Browser.mainLoop.tickStartTime = _emscripten_get_now()
        }
        GL.newRenderingFrameStarted();
        if (Browser.mainLoop.method === "timeout" && Module.ctx) {
            warnOnce("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");
            Browser.mainLoop.method = ""
        }
        Browser.mainLoop.runIter(browserIterationFunc);
        checkStackCookie();
        if (!checkIsRunning()) return;
        if (typeof SDL == "object" && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
        Browser.mainLoop.scheduler()
    };
    if (!noSetTiming) {
        if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
        else _emscripten_set_main_loop_timing(1, 1);
        Browser.mainLoop.scheduler()
    }
    if (simulateInfiniteLoop) {
        throw "unwind"
    }
}

function handleException(e) {
    if (e instanceof ExitStatus || e == "unwind") {
        return EXITSTATUS
    }
    checkStackCookie();
    if (e instanceof WebAssembly.RuntimeError) {
        if (_emscripten_stack_get_current() <= 0) {
            err("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to " + 65536 + ")")
        }
    }
    quit_(1, e)
}

function _proc_exit(code) {
    EXITSTATUS = code;
    if (!keepRuntimeAlive()) {
        if (Module["onExit"]) Module["onExit"](code);
        ABORT = true
    }
    quit_(code, new ExitStatus(code))
}

function exitJS(status, implicit) {
    EXITSTATUS = status;
    checkUnflushedContent();
    if (keepRuntimeAlive() && !implicit) {
        var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
        err(msg)
    }
    _proc_exit(status)
}
var _exit = exitJS;

function maybeExit() {
    if (!keepRuntimeAlive()) {
        try {
            _exit(EXITSTATUS)
        } catch (e) {
            handleException(e)
        }
    }
}

function callUserCallback(func) {
    if (ABORT) {
        err("user callback triggered after runtime exited or application aborted.  Ignoring.");
        return
    }
    try {
        func();
        maybeExit()
    } catch (e) {
        handleException(e)
    }
}

function safeSetTimeout(func, timeout) {
    return setTimeout(() => {
        callUserCallback(func)
    }, timeout)
}
var Browser = {
    mainLoop: {
        running: false,
        scheduler: null,
        method: "",
        currentlyRunningMainloop: 0,
        func: null,
        arg: 0,
        timingMode: 0,
        timingValue: 0,
        currentFrameNumber: 0,
        queue: [],
        pause: function() {
            Browser.mainLoop.scheduler = null;
            Browser.mainLoop.currentlyRunningMainloop++
        },
        resume: function() {
            Browser.mainLoop.currentlyRunningMainloop++;
            var timingMode = Browser.mainLoop.timingMode;
            var timingValue = Browser.mainLoop.timingValue;
            var func = Browser.mainLoop.func;
            Browser.mainLoop.func = null;
            setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
            _emscripten_set_main_loop_timing(timingMode, timingValue);
            Browser.mainLoop.scheduler()
        },
        updateStatus: function() {
            if (Module["setStatus"]) {
                var message = Module["statusMessage"] || "Please wait...";
                var remaining = Browser.mainLoop.remainingBlockers;
                var expected = Browser.mainLoop.expectedBlockers;
                if (remaining) {
                    if (remaining < expected) {
                        Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")")
                    } else {
                        Module["setStatus"](message)
                    }
                } else {
                    Module["setStatus"]("")
                }
            }
        },
        runIter: function(func) {
            if (ABORT) return;
            if (Module["preMainLoop"]) {
                var preRet = Module["preMainLoop"]();
                if (preRet === false) {
                    return
                }
            }
            callUserCallback(func);
            if (Module["postMainLoop"]) Module["postMainLoop"]()
        }
    },
    isFullscreen: false,
    pointerLock: false,
    moduleContextCreatedCallbacks: [],
    workers: [],
    init: function() {
        if (Browser.initted) return;
        Browser.initted = true;
        var imagePlugin = {};
        imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
            return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
        };
        imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
            var b = new Blob([byteArray], {
                type: Browser.getMimetype(name)
            });
            if (b.size !== byteArray.length) {
                b = new Blob([new Uint8Array(byteArray).buffer], {
                    type: Browser.getMimetype(name)
                })
            }
            var url = URL.createObjectURL(b);
            assert(typeof url == "string", "createObjectURL must return a url as a string");
            var img = new Image;
            img.onload = () => {
                assert(img.complete, "Image " + name + " could not be decoded");
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                preloadedImages[name] = canvas;
                URL.revokeObjectURL(url);
                if (onload) onload(byteArray)
            };
            img.onerror = event => {
                out("Image " + url + " could not be decoded");
                if (onerror) onerror()
            };
            img.src = url
        };
        preloadPlugins.push(imagePlugin);
        var audioPlugin = {};
        audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
            return !Module.noAudioDecoding && name.substr(-4) in {
                ".ogg": 1,
                ".wav": 1,
                ".mp3": 1
            }
        };
        audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
            var done = false;

            function finish(audio) {
                if (done) return;
                done = true;
                preloadedAudios[name] = audio;
                if (onload) onload(byteArray)
            }
            var b = new Blob([byteArray], {
                type: Browser.getMimetype(name)
            });
            var url = URL.createObjectURL(b);
            assert(typeof url == "string", "createObjectURL must return a url as a string");
            var audio = new Audio;
            audio.addEventListener("canplaythrough", () => finish(audio), false);
            audio.onerror = function audio_onerror(event) {
                if (done) return;
                err("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");

                function encode64(data) {
                    var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                    var PAD = "=";
                    var ret = "";
                    var leftchar = 0;
                    var leftbits = 0;
                    for (var i = 0; i < data.length; i++) {
                        leftchar = leftchar << 8 | data[i];
                        leftbits += 8;
                        while (leftbits >= 6) {
                            var curr = leftchar >> leftbits - 6 & 63;
                            leftbits -= 6;
                            ret += BASE[curr]
                        }
                    }
                    if (leftbits == 2) {
                        ret += BASE[(leftchar & 3) << 4];
                        ret += PAD + PAD
                    } else if (leftbits == 4) {
                        ret += BASE[(leftchar & 15) << 2];
                        ret += PAD
                    }
                    return ret
                }
                audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
                finish(audio)
            };
            audio.src = url;
            safeSetTimeout(() => {
                finish(audio)
            }, 1e4)
        };
        preloadPlugins.push(audioPlugin);

        function pointerLockChange() {
            Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"]
        }
        var canvas = Module["canvas"];
        if (canvas) {
            canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (() => {});
            canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (() => {});
            canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
            document.addEventListener("pointerlockchange", pointerLockChange, false);
            document.addEventListener("mozpointerlockchange", pointerLockChange, false);
            document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
            document.addEventListener("mspointerlockchange", pointerLockChange, false);
            if (Module["elementPointerLock"]) {
                canvas.addEventListener("click", ev => {
                    if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                        Module["canvas"].requestPointerLock();
                        ev.preventDefault()
                    }
                }, false)
            }
        }
    },
    createContext: function(canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
        var ctx;
        var contextHandle;
        if (useWebGL) {
            var contextAttributes = {
                antialias: false,
                alpha: false,
                majorVersion: 2
            };
            if (webGLContextAttributes) {
                for (var attribute in webGLContextAttributes) {
                    contextAttributes[attribute] = webGLContextAttributes[attribute]
                }
            }
            if (typeof GL != "undefined") {
                contextHandle = GL.createContext(canvas, contextAttributes);
                if (contextHandle) {
                    ctx = GL.getContext(contextHandle).GLctx
                }
            }
        } else {
            ctx = canvas.getContext("2d")
        }
        if (!ctx) return null;
        if (setInModule) {
            if (!useWebGL) assert(typeof GLctx == "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
            Module.ctx = ctx;
            if (useWebGL) GL.makeContextCurrent(contextHandle);
            Module.useWebGL = useWebGL;
            Browser.moduleContextCreatedCallbacks.forEach(callback => callback());
            Browser.init()
        }
        return ctx
    },
    destroyContext: function(canvas, useWebGL, setInModule) {},
    fullscreenHandlersInstalled: false,
    lockPointer: undefined,
    resizeCanvas: undefined,
    requestFullscreen: function(lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
        var canvas = Module["canvas"];

        function fullscreenChange() {
            Browser.isFullscreen = false;
            var canvasContainer = canvas.parentNode;
            if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
                canvas.exitFullscreen = Browser.exitFullscreen;
                if (Browser.lockPointer) canvas.requestPointerLock();
                Browser.isFullscreen = true;
                if (Browser.resizeCanvas) {
                    Browser.setFullscreenCanvasSize()
                } else {
                    Browser.updateCanvasDimensions(canvas)
                }
            } else {
                canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                canvasContainer.parentNode.removeChild(canvasContainer);
                if (Browser.resizeCanvas) {
                    Browser.setWindowedCanvasSize()
                } else {
                    Browser.updateCanvasDimensions(canvas)
                }
            }
            if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
            if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen)
        }
        if (!Browser.fullscreenHandlersInstalled) {
            Browser.fullscreenHandlersInstalled = true;
            document.addEventListener("fullscreenchange", fullscreenChange, false);
            document.addEventListener("mozfullscreenchange", fullscreenChange, false);
            document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
            document.addEventListener("MSFullscreenChange", fullscreenChange, false)
        }
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? () => canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null) || (canvasContainer["webkitRequestFullScreen"] ? () => canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null);
        canvasContainer.requestFullscreen()
    },
    requestFullScreen: function() {
        abort("Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)")
    },
    exitFullscreen: function() {
        if (!Browser.isFullscreen) {
            return false
        }
        var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (() => {});
        CFS.apply(document, []);
        return true
    },
    nextRAF: 0,
    fakeRequestAnimationFrame: function(func) {
        var now = Date.now();
        if (Browser.nextRAF === 0) {
            Browser.nextRAF = now + 1e3 / 60
        } else {
            while (now + 2 >= Browser.nextRAF) {
                Browser.nextRAF += 1e3 / 60
            }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay)
    },
    requestAnimationFrame: function(func) {
        if (typeof requestAnimationFrame == "function") {
            requestAnimationFrame(func);
            return
        }
        var RAF = Browser.fakeRequestAnimationFrame;
        RAF(func)
    },
    safeSetTimeout: function(func, timeout) {
        return safeSetTimeout(func, timeout)
    },
    safeRequestAnimationFrame: function(func) {
        return Browser.requestAnimationFrame(() => {
            callUserCallback(func)
        })
    },
    getMimetype: function(name) {
        return {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "bmp": "image/bmp",
            "ogg": "audio/ogg",
            "wav": "audio/wav",
            "mp3": "audio/mpeg"
        } [name.substr(name.lastIndexOf(".") + 1)]
    },
    getUserMedia: function(func) {
        if (!window.getUserMedia) {
            window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]
        }
        window.getUserMedia(func)
    },
    getMovementX: function(event) {
        return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
    },
    getMovementY: function(event) {
        return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
    },
    getMouseWheelDelta: function(event) {
        var delta = 0;
        switch (event.type) {
            case "DOMMouseScroll":
                delta = event.detail / 3;
                break;
            case "mousewheel":
                delta = event.wheelDelta / 120;
                break;
            case "wheel":
                delta = event.deltaY;
                switch (event.deltaMode) {
                    case 0:
                        delta /= 100;
                        break;
                    case 1:
                        delta /= 3;
                        break;
                    case 2:
                        delta *= 80;
                        break;
                    default:
                        throw "unrecognized mouse wheel delta mode: " + event.deltaMode
                }
                break;
            default:
                throw "unrecognized mouse wheel event: " + event.type
        }
        return delta
    },
    mouseX: 0,
    mouseY: 0,
    mouseMovementX: 0,
    mouseMovementY: 0,
    touches: {},
    lastTouches: {},
    calculateMouseEvent: function(event) {
        if (Browser.pointerLock) {
            if (event.type != "mousemove" && "mozMovementX" in event) {
                Browser.mouseMovementX = Browser.mouseMovementY = 0
            } else {
                Browser.mouseMovementX = Browser.getMovementX(event);
                Browser.mouseMovementY = Browser.getMovementY(event)
            }
            if (typeof SDL != "undefined") {
                Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
            } else {
                Browser.mouseX += Browser.mouseMovementX;
                Browser.mouseY += Browser.mouseMovementY
            }
        } else {
            var rect = Module["canvas"].getBoundingClientRect();
            var cw = Module["canvas"].width;
            var ch = Module["canvas"].height;
            var scrollX = typeof window.scrollX != "undefined" ? window.scrollX : window.pageXOffset;
            var scrollY = typeof window.scrollY != "undefined" ? window.scrollY : window.pageYOffset;
            assert(typeof scrollX != "undefined" && typeof scrollY != "undefined", "Unable to retrieve scroll position, mouse positions likely broken.");
            if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                var touch = event.touch;
                if (touch === undefined) {
                    return
                }
                var adjustedX = touch.pageX - (scrollX + rect.left);
                var adjustedY = touch.pageY - (scrollY + rect.top);
                adjustedX = adjustedX * (cw / rect.width);
                adjustedY = adjustedY * (ch / rect.height);
                var coords = {
                    x: adjustedX,
                    y: adjustedY
                };
                if (event.type === "touchstart") {
                    Browser.lastTouches[touch.identifier] = coords;
                    Browser.touches[touch.identifier] = coords
                } else if (event.type === "touchend" || event.type === "touchmove") {
                    var last = Browser.touches[touch.identifier];
                    if (!last) last = coords;
                    Browser.lastTouches[touch.identifier] = last;
                    Browser.touches[touch.identifier] = coords
                }
                return
            }
            var x = event.pageX - (scrollX + rect.left);
            var y = event.pageY - (scrollY + rect.top);
            x = x * (cw / rect.width);
            y = y * (ch / rect.height);
            Browser.mouseMovementX = x - Browser.mouseX;
            Browser.mouseMovementY = y - Browser.mouseY;
            Browser.mouseX = x;
            Browser.mouseY = y
        }
    },
    resizeListeners: [],
    updateResizeListeners: function() {
        var canvas = Module["canvas"];
        Browser.resizeListeners.forEach(listener => listener(canvas.width, canvas.height))
    },
    setCanvasSize: function(width, height, noUpdates) {
        var canvas = Module["canvas"];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners()
    },
    windowedWidth: 0,
    windowedHeight: 0,
    setFullscreenCanvasSize: function() {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen >>> 2];
            flags = flags | 8388608;
            HEAP32[SDL.screen >>> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"]);
        Browser.updateResizeListeners()
    },
    setWindowedCanvasSize: function() {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen >>> 2];
            flags = flags & ~8388608;
            HEAP32[SDL.screen >>> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"]);
        Browser.updateResizeListeners()
    },
    updateCanvasDimensions: function(canvas, wNative, hNative) {
        if (wNative && hNative) {
            canvas.widthNative = wNative;
            canvas.heightNative = hNative
        } else {
            wNative = canvas.widthNative;
            hNative = canvas.heightNative
        }
        var w = wNative;
        var h = hNative;
        if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
            if (w / h < Module["forcedAspectRatio"]) {
                w = Math.round(h * Module["forcedAspectRatio"])
            } else {
                h = Math.round(w / Module["forcedAspectRatio"])
            }
        }
        if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
            var factor = Math.min(screen.width / w, screen.height / h);
            w = Math.round(w * factor);
            h = Math.round(h * factor)
        }
        if (Browser.resizeCanvas) {
            if (canvas.width != w) canvas.width = w;
            if (canvas.height != h) canvas.height = h;
            if (typeof canvas.style != "undefined") {
                canvas.style.removeProperty("width");
                canvas.style.removeProperty("height")
            }
        } else {
            if (canvas.width != wNative) canvas.width = wNative;
            if (canvas.height != hNative) canvas.height = hNative;
            if (typeof canvas.style != "undefined") {
                if (w != wNative || h != hNative) {
                    canvas.style.setProperty("width", w + "px", "important");
                    canvas.style.setProperty("height", h + "px", "important")
                } else {
                    canvas.style.removeProperty("width");
                    canvas.style.removeProperty("height")
                }
            }
        }
    }
};
var EGL = {
    errorCode: 12288,
    defaultDisplayInitialized: false,
    currentContext: 0,
    currentReadSurface: 0,
    currentDrawSurface: 0,
    contextAttributes: {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false
    },
    stringCache: {},
    setErrorCode: function(code) {
        EGL.errorCode = code
    },
    chooseConfig: function(display, attribList, config, config_size, numConfigs) {
        if (display != 62e3) {
            EGL.setErrorCode(12296);
            return 0
        }
        if (attribList) {
            for (;;) {
                var param = HEAP32[attribList >>> 2];
                if (param == 12321) {
                    var alphaSize = HEAP32[attribList + 4 >>> 2];
                    EGL.contextAttributes.alpha = alphaSize > 0
                } else if (param == 12325) {
                    var depthSize = HEAP32[attribList + 4 >>> 2];
                    EGL.contextAttributes.depth = depthSize > 0
                } else if (param == 12326) {
                    var stencilSize = HEAP32[attribList + 4 >>> 2];
                    EGL.contextAttributes.stencil = stencilSize > 0
                } else if (param == 12337) {
                    var samples = HEAP32[attribList + 4 >>> 2];
                    EGL.contextAttributes.antialias = samples > 0
                } else if (param == 12338) {
                    var samples = HEAP32[attribList + 4 >>> 2];
                    EGL.contextAttributes.antialias = samples == 1
                } else if (param == 12544) {
                    var requestedPriority = HEAP32[attribList + 4 >>> 2];
                    EGL.contextAttributes.lowLatency = requestedPriority != 12547
                } else if (param == 12344) {
                    break
                }
                attribList += 8
            }
        }
        if ((!config || !config_size) && !numConfigs) {
            EGL.setErrorCode(12300);
            return 0
        }
        if (numConfigs) {
            HEAP32[numConfigs >>> 2] = 1
        }
        if (config && config_size > 0) {
            HEAP32[config >>> 2] = 62002
        }
        EGL.setErrorCode(12288);
        return 1
    }
};

function _eglBindAPI(api) {
    if (api == 12448) {
        EGL.setErrorCode(12288);
        return 1
    }
    EGL.setErrorCode(12300);
    return 0
}

function _eglChooseConfig(display, attrib_list, configs, config_size, numConfigs) {
    return EGL.chooseConfig(display, attrib_list, configs, config_size, numConfigs)
}

function webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(ctx) {
    return !!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"))
}

function webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(ctx) {
    return !!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"))
}

function webgl_enable_WEBGL_multi_draw(ctx) {
    return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"))
}
var GL = {
    counter: 1,
    buffers: [],
    mappedBuffers: {},
    programs: [],
    framebuffers: [],
    renderbuffers: [],
    textures: [],
    shaders: [],
    vaos: [],
    contexts: [],
    offscreenCanvases: {},
    queries: [],
    samplers: [],
    transformFeedbacks: [],
    syncs: [],
    byteSizeByTypeRoot: 5120,
    byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
    stringCache: {},
    stringiCache: {},
    unpackAlignment: 4,
    recordError: function recordError(errorCode) {
        if (!GL.lastError) {
            GL.lastError = errorCode
        }
    },
    getNewId: function(table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
            table[i] = null
        }
        return ret
    },
    MAX_TEMP_BUFFER_SIZE: 2097152,
    numTempVertexBuffersPerSize: 64,
    log2ceilLookup: function(i) {
        return 32 - Math.clz32(i === 0 ? 0 : i - 1)
    },
    generateTempBuffers: function(quads, context) {
        var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        context.tempVertexBufferCounters1 = [];
        context.tempVertexBufferCounters2 = [];
        context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex + 1;
        context.tempVertexBuffers1 = [];
        context.tempVertexBuffers2 = [];
        context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex + 1;
        context.tempIndexBuffers = [];
        context.tempIndexBuffers.length = largestIndex + 1;
        for (var i = 0; i <= largestIndex; ++i) {
            context.tempIndexBuffers[i] = null;
            context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
            var ringbufferLength = GL.numTempVertexBuffersPerSize;
            context.tempVertexBuffers1[i] = [];
            context.tempVertexBuffers2[i] = [];
            var ringbuffer1 = context.tempVertexBuffers1[i];
            var ringbuffer2 = context.tempVertexBuffers2[i];
            ringbuffer1.length = ringbuffer2.length = ringbufferLength;
            for (var j = 0; j < ringbufferLength; ++j) {
                ringbuffer1[j] = ringbuffer2[j] = null
            }
        }
        if (quads) {
            context.tempQuadIndexBuffer = GLctx.createBuffer();
            context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
            var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
            var quadIndexes = new Uint16Array(numIndexes);
            var i = 0,
                v = 0;
            while (1) {
                quadIndexes[i++] = v;
                if (i >= numIndexes) break;
                quadIndexes[i++] = v + 1;
                if (i >= numIndexes) break;
                quadIndexes[i++] = v + 2;
                if (i >= numIndexes) break;
                quadIndexes[i++] = v;
                if (i >= numIndexes) break;
                quadIndexes[i++] = v + 2;
                if (i >= numIndexes) break;
                quadIndexes[i++] = v + 3;
                if (i >= numIndexes) break;
                v += 4
            }
            context.GLctx.bufferData(34963, quadIndexes, 35044);
            context.GLctx.bindBuffer(34963, null)
        }
    },
    getTempVertexBuffer: function getTempVertexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup(sizeBytes);
        var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
        var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
        GL.currentContext.tempVertexBufferCounters1[idx] = GL.currentContext.tempVertexBufferCounters1[idx] + 1 & GL.numTempVertexBuffersPerSize - 1;
        var vbo = ringbuffer[nextFreeBufferIndex];
        if (vbo) {
            return vbo
        }
        var prevVBO = GLctx.getParameter(34964);
        ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
        GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
        GLctx.bufferData(34962, 1 << idx, 35048);
        GLctx.bindBuffer(34962, prevVBO);
        return ringbuffer[nextFreeBufferIndex]
    },
    getTempIndexBuffer: function getTempIndexBuffer(sizeBytes) {
        var idx = GL.log2ceilLookup(sizeBytes);
        var ibo = GL.currentContext.tempIndexBuffers[idx];
        if (ibo) {
            return ibo
        }
        var prevIBO = GLctx.getParameter(34965);
        GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
        GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
        GLctx.bufferData(34963, 1 << idx, 35048);
        GLctx.bindBuffer(34963, prevIBO);
        return GL.currentContext.tempIndexBuffers[idx]
    },
    newRenderingFrameStarted: function newRenderingFrameStarted() {
        if (!GL.currentContext) {
            return
        }
        var vb = GL.currentContext.tempVertexBuffers1;
        GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
        GL.currentContext.tempVertexBuffers2 = vb;
        vb = GL.currentContext.tempVertexBufferCounters1;
        GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
        GL.currentContext.tempVertexBufferCounters2 = vb;
        var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        for (var i = 0; i <= largestIndex; ++i) {
            GL.currentContext.tempVertexBufferCounters1[i] = 0
        }
    },
    getSource: function(shader, count, string, length) {
        var source = "";
        for (var i = 0; i < count; ++i) {
            var len = length ? HEAP32[length + i * 4 >>> 2] : -1;
            source += UTF8ToString(HEAP32[string + i * 4 >>> 2], len < 0 ? undefined : len)
        }
        return source
    },
    calcBufLength: function calcBufLength(size, type, stride, count) {
        if (stride > 0) {
            return count * stride
        }
        var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
        return size * typeSize * count
    },
    usedTempBuffers: [],
    preDrawHandleClientVertexAttribBindings: function preDrawHandleClientVertexAttribBindings(count) {
        GL.resetBufferBinding = false;
        for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
            var cb = GL.currentContext.clientBuffers[i];
            if (!cb.clientside || !cb.enabled) continue;
            GL.resetBufferBinding = true;
            var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
            var buf = GL.getTempVertexBuffer(size);
            GLctx.bindBuffer(34962, buf);
            GLctx.bufferSubData(34962, 0, HEAPU8.subarray(cb.ptr >>> 0, cb.ptr + size >>> 0));
            cb.vertexAttribPointerAdaptor.call(GLctx, i, cb.size, cb.type, cb.normalized, cb.stride, 0)
        }
    },
    postDrawHandleClientVertexAttribBindings: function postDrawHandleClientVertexAttribBindings() {
        if (GL.resetBufferBinding) {
            GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding])
        }
    },
    createContext: function(canvas, webGLContextAttributes) {
        if (!canvas.getContextSafariWebGL2Fixed) {
            canvas.getContextSafariWebGL2Fixed = canvas.getContext;

            function fixedGetContext(ver, attrs) {
                var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
                return ver == "webgl" == gl instanceof WebGLRenderingContext ? gl : null
            }
            canvas.getContext = fixedGetContext
        }
        var ctx = canvas.getContext("webgl2", webGLContextAttributes);
        if (!ctx) return 0;
        var handle = GL.registerContext(ctx, webGLContextAttributes);
        return handle
    },
    registerContext: function(ctx, webGLContextAttributes) {
        var handle = GL.getNewId(GL.contexts);
        var context = {
            handle: handle,
            attributes: webGLContextAttributes,
            version: webGLContextAttributes.majorVersion,
            GLctx: ctx
        };
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
            GL.initExtensions(context)
        }
        context.maxVertexAttribs = context.GLctx.getParameter(34921);
        context.clientBuffers = [];
        for (var i = 0; i < context.maxVertexAttribs; i++) {
            context.clientBuffers[i] = {
                enabled: false,
                clientside: false,
                size: 0,
                type: 0,
                normalized: 0,
                stride: 0,
                ptr: 0,
                vertexAttribPointerAdaptor: null
            }
        }
        GL.generateTempBuffers(false, context);
        return handle
    },
    makeContextCurrent: function(contextHandle) {
        GL.currentContext = GL.contexts[contextHandle];
        Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
        return !(contextHandle && !GLctx)
    },
    getContext: function(contextHandle) {
        return GL.contexts[contextHandle]
    },
    deleteContext: function(contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
        if (typeof JSEvents == "object") JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        GL.contexts[contextHandle] = null
    },
    initExtensions: function(context) {
        if (!context) context = GL.currentContext;
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
        var GLctx = context.GLctx;
        webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
        webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
        if (context.version >= 2) {
            GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2")
        }
        if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
            GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query")
        }
        webgl_enable_WEBGL_multi_draw(GLctx);
        var exts = GLctx.getSupportedExtensions() || [];
        exts.forEach(function(ext) {
            if (!ext.includes("lose_context") && !ext.includes("debug")) {
                GLctx.getExtension(ext)
            }
        })
    }
};

function _eglCreateContext(display, config, hmm, contextAttribs) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    var glesContextVersion = 1;
    for (;;) {
        var param = HEAP32[contextAttribs >>> 2];
        if (param == 12440) {
            glesContextVersion = HEAP32[contextAttribs + 4 >>> 2]
        } else if (param == 12344) {
            break
        } else {
            EGL.setErrorCode(12292);
            return 0
        }
        contextAttribs += 8
    }
    if (glesContextVersion < 2 || glesContextVersion > 3) {
        EGL.setErrorCode(12293);
        return 0
    }
    EGL.contextAttributes.majorVersion = glesContextVersion - 1;
    EGL.contextAttributes.minorVersion = 0;
    EGL.context = GL.createContext(Module["canvas"], EGL.contextAttributes);
    if (EGL.context != 0) {
        EGL.setErrorCode(12288);
        GL.makeContextCurrent(EGL.context);
        Module.useWebGL = true;
        Browser.moduleContextCreatedCallbacks.forEach(function(callback) {
            callback()
        });
        GL.makeContextCurrent(null);
        return 62004
    } else {
        EGL.setErrorCode(12297);
        return 0
    }
}

function _eglCreateWindowSurface(display, config, win, attrib_list) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (config != 62002) {
        EGL.setErrorCode(12293);
        return 0
    }
    EGL.setErrorCode(12288);
    return 62006
}

function _eglDestroyContext(display, context) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (context != 62004) {
        EGL.setErrorCode(12294);
        return 0
    }
    GL.deleteContext(EGL.context);
    EGL.setErrorCode(12288);
    if (EGL.currentContext == context) {
        EGL.currentContext = 0
    }
    return 1
}

function _eglDestroySurface(display, surface) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (surface != 62006) {
        EGL.setErrorCode(12301);
        return 1
    }
    if (EGL.currentReadSurface == surface) {
        EGL.currentReadSurface = 0
    }
    if (EGL.currentDrawSurface == surface) {
        EGL.currentDrawSurface = 0
    }
    EGL.setErrorCode(12288);
    return 1
}

function _eglGetConfigAttrib(display, config, attribute, value) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (config != 62002) {
        EGL.setErrorCode(12293);
        return 0
    }
    if (!value) {
        EGL.setErrorCode(12300);
        return 0
    }
    EGL.setErrorCode(12288);
    switch (attribute) {
        case 12320:
            HEAP32[value >>> 2] = EGL.contextAttributes.alpha ? 32 : 24;
            return 1;
        case 12321:
            HEAP32[value >>> 2] = EGL.contextAttributes.alpha ? 8 : 0;
            return 1;
        case 12322:
            HEAP32[value >>> 2] = 8;
            return 1;
        case 12323:
            HEAP32[value >>> 2] = 8;
            return 1;
        case 12324:
            HEAP32[value >>> 2] = 8;
            return 1;
        case 12325:
            HEAP32[value >>> 2] = EGL.contextAttributes.depth ? 24 : 0;
            return 1;
        case 12326:
            HEAP32[value >>> 2] = EGL.contextAttributes.stencil ? 8 : 0;
            return 1;
        case 12327:
            HEAP32[value >>> 2] = 12344;
            return 1;
        case 12328:
            HEAP32[value >>> 2] = 62002;
            return 1;
        case 12329:
            HEAP32[value >>> 2] = 0;
            return 1;
        case 12330:
            HEAP32[value >>> 2] = 4096;
            return 1;
        case 12331:
            HEAP32[value >>> 2] = 16777216;
            return 1;
        case 12332:
            HEAP32[value >>> 2] = 4096;
            return 1;
        case 12333:
            HEAP32[value >>> 2] = 0;
            return 1;
        case 12334:
            HEAP32[value >>> 2] = 0;
            return 1;
        case 12335:
            HEAP32[value >>> 2] = 12344;
            return 1;
        case 12337:
            HEAP32[value >>> 2] = EGL.contextAttributes.antialias ? 4 : 0;
            return 1;
        case 12338:
            HEAP32[value >>> 2] = EGL.contextAttributes.antialias ? 1 : 0;
            return 1;
        case 12339:
            HEAP32[value >>> 2] = 4;
            return 1;
        case 12340:
            HEAP32[value >>> 2] = 12344;
            return 1;
        case 12341:
        case 12342:
        case 12343:
            HEAP32[value >>> 2] = -1;
            return 1;
        case 12345:
        case 12346:
            HEAP32[value >>> 2] = 0;
            return 1;
        case 12347:
            HEAP32[value >>> 2] = 0;
            return 1;
        case 12348:
            HEAP32[value >>> 2] = 1;
            return 1;
        case 12349:
        case 12350:
            HEAP32[value >>> 2] = 0;
            return 1;
        case 12351:
            HEAP32[value >>> 2] = 12430;
            return 1;
        case 12352:
            HEAP32[value >>> 2] = 4;
            return 1;
        case 12354:
            HEAP32[value >>> 2] = 0;
            return 1;
        default:
            EGL.setErrorCode(12292);
            return 0
    }
}

function _eglGetDisplay(nativeDisplayType) {
    EGL.setErrorCode(12288);
    return 62e3
}

function _eglGetError() {
    return EGL.errorCode
}

function _eglInitialize(display, majorVersion, minorVersion) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (majorVersion) {
        HEAP32[majorVersion >>> 2] = 1
    }
    if (minorVersion) {
        HEAP32[minorVersion >>> 2] = 4
    }
    EGL.defaultDisplayInitialized = true;
    EGL.setErrorCode(12288);
    return 1
}

function _eglMakeCurrent(display, draw, read, context) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (context != 0 && context != 62004) {
        EGL.setErrorCode(12294);
        return 0
    }
    if (read != 0 && read != 62006 || draw != 0 && draw != 62006) {
        EGL.setErrorCode(12301);
        return 0
    }
    GL.makeContextCurrent(context ? EGL.context : null);
    EGL.currentContext = context;
    EGL.currentDrawSurface = draw;
    EGL.currentReadSurface = read;
    EGL.setErrorCode(12288);
    return 1
}

function stringToNewUTF8(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = _malloc(size);
    if (ret) stringToUTF8(str, ret, size);
    return ret
}

function _eglQueryString(display, name) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    EGL.setErrorCode(12288);
    if (EGL.stringCache[name]) return EGL.stringCache[name];
    var ret;
    switch (name) {
        case 12371:
            ret = stringToNewUTF8("Emscripten");
            break;
        case 12372:
            ret = stringToNewUTF8("1.4 Emscripten EGL");
            break;
        case 12373:
            ret = stringToNewUTF8("");
            break;
        case 12429:
            ret = stringToNewUTF8("OpenGL_ES");
            break;
        default:
            EGL.setErrorCode(12300);
            return 0
    }
    EGL.stringCache[name] = ret;
    return ret
}

function _eglSwapBuffers(dpy, surface) {
    if (!EGL.defaultDisplayInitialized) {
        EGL.setErrorCode(12289)
    } else if (!Module.ctx) {
        EGL.setErrorCode(12290)
    } else if (Module.ctx.isContextLost()) {
        EGL.setErrorCode(12302)
    } else {
        EGL.setErrorCode(12288);
        return 1
    }
    return 0
}

function _eglSwapInterval(display, interval) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (interval == 0) _emscripten_set_main_loop_timing(0, 0);
    else _emscripten_set_main_loop_timing(1, interval);
    EGL.setErrorCode(12288);
    return 1
}

function _eglTerminate(display) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    EGL.currentContext = 0;
    EGL.currentReadSurface = 0;
    EGL.currentDrawSurface = 0;
    EGL.defaultDisplayInitialized = false;
    EGL.setErrorCode(12288);
    return 1
}

function _eglWaitClient() {
    EGL.setErrorCode(12288);
    return 1
}
var _eglWaitGL = _eglWaitClient;

function _eglWaitNative(nativeEngineId) {
    EGL.setErrorCode(12288);
    return 1
}
var readEmAsmArgsArray = [];

function readEmAsmArgs(sigPtr, buf) {
    assert(Array.isArray(readEmAsmArgsArray));
    assert(buf % 16 == 0);
    readEmAsmArgsArray.length = 0;
    var ch;
    buf >>= 2;
    while (ch = HEAPU8[sigPtr++ >>> 0]) {
        var chr = String.fromCharCode(ch);
        var validChars = ["d", "f", "i"];
        assert(validChars.includes(chr), `Invalid character ${ch}("${chr}") in readEmAsmArgs! Use only [${validChars}], and do not specify "v" for void return argument.`);
        buf += ch != 105 & buf;
        readEmAsmArgsArray.push(ch == 105 ? HEAP32[buf >>> 0] : HEAPF64[buf++ >>> 1]);
        ++buf
    }
    return readEmAsmArgsArray
}

function runMainThreadEmAsm(code, sigPtr, argbuf, sync) {
    var args = readEmAsmArgs(sigPtr, argbuf);
    if (!ASM_CONSTS.hasOwnProperty(code)) abort("No EM_ASM constant found at address " + code);
    return ASM_CONSTS[code].apply(null, args)
}

function _emscripten_asm_const_async_on_main_thread(code, sigPtr, argbuf) {
    return runMainThreadEmAsm(code, sigPtr, argbuf, 0)
}

function runEmAsmFunction(code, sigPtr, argbuf) {
    var args = readEmAsmArgs(sigPtr, argbuf);
    if (!ASM_CONSTS.hasOwnProperty(code)) abort("No EM_ASM constant found at address " + code);
    return ASM_CONSTS[code].apply(null, args)
}

function _emscripten_asm_const_int(code, sigPtr, argbuf) {
    return runEmAsmFunction(code, sigPtr, argbuf)
}

function _emscripten_asm_const_int_sync_on_main_thread(code, sigPtr, argbuf) {
    return runMainThreadEmAsm(code, sigPtr, argbuf, 1)
}

function _emscripten_date_now() {
    return Date.now()
}

function withStackSave(f) {
    var stack = stackSave();
    var ret = f();
    stackRestore(stack);
    return ret
}
var JSEvents = {
    inEventHandler: 0,
    removeAllEventListeners: function() {
        for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
            JSEvents._removeHandler(i)
        }
        JSEvents.eventHandlers = [];
        JSEvents.deferredCalls = []
    },
    registerRemoveEventListeners: function() {
        if (!JSEvents.removeEventListenersRegistered) {
            __ATEXIT__.push(JSEvents.removeAllEventListeners);
            JSEvents.removeEventListenersRegistered = true
        }
    },
    deferredCalls: [],
    deferCall: function(targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
            if (arrA.length != arrB.length) return false;
            for (var i in arrA) {
                if (arrA[i] != arrB[i]) return false
            }
            return true
        }
        for (var i in JSEvents.deferredCalls) {
            var call = JSEvents.deferredCalls[i];
            if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
                return
            }
        }
        JSEvents.deferredCalls.push({
            targetFunction: targetFunction,
            precedence: precedence,
            argsList: argsList
        });
        JSEvents.deferredCalls.sort(function(x, y) {
            return x.precedence < y.precedence
        })
    },
    removeDeferredCalls: function(targetFunction) {
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
            if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
                JSEvents.deferredCalls.splice(i, 1);
                --i
            }
        }
    },
    canPerformEventHandlerRequests: function() {
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls
    },
    runDeferredCalls: function() {
        if (!JSEvents.canPerformEventHandlerRequests()) {
            return
        }
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
            var call = JSEvents.deferredCalls[i];
            JSEvents.deferredCalls.splice(i, 1);
            --i;
            call.targetFunction.apply(null, call.argsList)
        }
    },
    eventHandlers: [],
    removeAllHandlersOnTarget: function(target, eventTypeString) {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
                JSEvents._removeHandler(i--)
            }
        }
    },
    _removeHandler: function(i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1)
    },
    registerOrRemoveHandler: function(eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
            ++JSEvents.inEventHandler;
            JSEvents.currentEventHandler = eventHandler;
            JSEvents.runDeferredCalls();
            eventHandler.handlerFunc(event);
            JSEvents.runDeferredCalls();
            --JSEvents.inEventHandler
        };
        if (eventHandler.callbackfunc) {
            eventHandler.eventListenerFunc = jsEventHandler;
            eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
            JSEvents.eventHandlers.push(eventHandler);
            JSEvents.registerRemoveEventListeners()
        } else {
            for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
                if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
                    JSEvents._removeHandler(i--)
                }
            }
        }
    },
    getNodeNameForTarget: function(target) {
        if (!target) return "";
        if (target == window) return "#window";
        if (target == screen) return "#screen";
        return target && target.nodeName ? target.nodeName : ""
    },
    fullscreenEnabled: function() {
        return document.fullscreenEnabled || document.webkitFullscreenEnabled
    }
};
var currentFullscreenStrategy = {};

function maybeCStringToJsString(cString) {
    return cString > 2 ? UTF8ToString(cString) : cString
}
var specialHTMLTargets = [0, typeof document != "undefined" ? document : 0, typeof window != "undefined" ? window : 0];

function findEventTarget(target) {
    target = maybeCStringToJsString(target);
    var domElement = specialHTMLTargets[target] || (typeof document != "undefined" ? document.querySelector(target) : undefined);
    return domElement
}

function findCanvasEventTarget(target) {
    return findEventTarget(target)
}

function _emscripten_get_canvas_element_size(target, width, height) {
    var canvas = findCanvasEventTarget(target);
    if (!canvas) return -4;
    HEAP32[width >>> 2] = canvas.width;
    HEAP32[height >>> 2] = canvas.height
}

function stringToUTF8OnStack(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = stackAlloc(size);
    stringToUTF8(str, ret, size);
    return ret
}

function getCanvasElementSize(target) {
    return withStackSave(function() {
        var w = stackAlloc(8);
        var h = w + 4;
        var targetInt = stringToUTF8OnStack(target.id);
        var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
        var size = [HEAP32[w >>> 2], HEAP32[h >>> 2]];
        return size
    })
}

function _emscripten_set_canvas_element_size(target, width, height) {
    var canvas = findCanvasEventTarget(target);
    if (!canvas) return -4;
    canvas.width = width;
    canvas.height = height;
    return 0
}

function setCanvasElementSize(target, width, height) {
    if (!target.controlTransferredOffscreen) {
        target.width = width;
        target.height = height
    } else {
        withStackSave(function() {
            var targetInt = stringToUTF8OnStack(target.id);
            _emscripten_set_canvas_element_size(targetInt, width, height)
        })
    }
}

function registerRestoreOldStyle(canvas) {
    var canvasSize = getCanvasElementSize(canvas);
    var oldWidth = canvasSize[0];
    var oldHeight = canvasSize[1];
    var oldCssWidth = canvas.style.width;
    var oldCssHeight = canvas.style.height;
    var oldBackgroundColor = canvas.style.backgroundColor;
    var oldDocumentBackgroundColor = document.body.style.backgroundColor;
    var oldPaddingLeft = canvas.style.paddingLeft;
    var oldPaddingRight = canvas.style.paddingRight;
    var oldPaddingTop = canvas.style.paddingTop;
    var oldPaddingBottom = canvas.style.paddingBottom;
    var oldMarginLeft = canvas.style.marginLeft;
    var oldMarginRight = canvas.style.marginRight;
    var oldMarginTop = canvas.style.marginTop;
    var oldMarginBottom = canvas.style.marginBottom;
    var oldDocumentBodyMargin = document.body.style.margin;
    var oldDocumentOverflow = document.documentElement.style.overflow;
    var oldDocumentScroll = document.body.scroll;
    var oldImageRendering = canvas.style.imageRendering;

    function restoreOldStyle() {
        var fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
        if (!fullscreenElement) {
            document.removeEventListener("fullscreenchange", restoreOldStyle);
            document.removeEventListener("webkitfullscreenchange", restoreOldStyle);
            setCanvasElementSize(canvas, oldWidth, oldHeight);
            canvas.style.width = oldCssWidth;
            canvas.style.height = oldCssHeight;
            canvas.style.backgroundColor = oldBackgroundColor;
            if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = "white";
            document.body.style.backgroundColor = oldDocumentBackgroundColor;
            canvas.style.paddingLeft = oldPaddingLeft;
            canvas.style.paddingRight = oldPaddingRight;
            canvas.style.paddingTop = oldPaddingTop;
            canvas.style.paddingBottom = oldPaddingBottom;
            canvas.style.marginLeft = oldMarginLeft;
            canvas.style.marginRight = oldMarginRight;
            canvas.style.marginTop = oldMarginTop;
            canvas.style.marginBottom = oldMarginBottom;
            document.body.style.margin = oldDocumentBodyMargin;
            document.documentElement.style.overflow = oldDocumentOverflow;
            document.body.scroll = oldDocumentScroll;
            canvas.style.imageRendering = oldImageRendering;
            if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
            if (currentFullscreenStrategy.canvasResizedCallback) {
                ((a1, a2, a3) => dynCall_iiii.apply(null, [currentFullscreenStrategy.canvasResizedCallback, a1, a2, a3]))(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData)
            }
        }
    }
    document.addEventListener("fullscreenchange", restoreOldStyle);
    document.addEventListener("webkitfullscreenchange", restoreOldStyle);
    return restoreOldStyle
}

function setLetterbox(element, topBottom, leftRight) {
    element.style.paddingLeft = element.style.paddingRight = leftRight + "px";
    element.style.paddingTop = element.style.paddingBottom = topBottom + "px"
}

function getBoundingClientRect(e) {
    return specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {
        "left": 0,
        "top": 0
    }
}

function JSEvents_resizeCanvasForFullscreen(target, strategy) {
    var restoreOldStyle = registerRestoreOldStyle(target);
    var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
    var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
    var rect = getBoundingClientRect(target);
    var windowedCssWidth = rect.width;
    var windowedCssHeight = rect.height;
    var canvasSize = getCanvasElementSize(target);
    var windowedRttWidth = canvasSize[0];
    var windowedRttHeight = canvasSize[1];
    if (strategy.scaleMode == 3) {
        setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
        cssWidth = windowedCssWidth;
        cssHeight = windowedCssHeight
    } else if (strategy.scaleMode == 2) {
        if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
            var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
            setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
            cssHeight = desiredCssHeight
        } else {
            var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
            setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
            cssWidth = desiredCssWidth
        }
    }
    if (!target.style.backgroundColor) target.style.backgroundColor = "black";
    if (!document.body.style.backgroundColor) document.body.style.backgroundColor = "black";
    target.style.width = cssWidth + "px";
    target.style.height = cssHeight + "px";
    if (strategy.filteringMode == 1) {
        target.style.imageRendering = "optimizeSpeed";
        target.style.imageRendering = "-moz-crisp-edges";
        target.style.imageRendering = "-o-crisp-edges";
        target.style.imageRendering = "-webkit-optimize-contrast";
        target.style.imageRendering = "optimize-contrast";
        target.style.imageRendering = "crisp-edges";
        target.style.imageRendering = "pixelated"
    }
    var dpiScale = strategy.canvasResolutionScaleMode == 2 ? devicePixelRatio : 1;
    if (strategy.canvasResolutionScaleMode != 0) {
        var newWidth = cssWidth * dpiScale | 0;
        var newHeight = cssHeight * dpiScale | 0;
        setCanvasElementSize(target, newWidth, newHeight);
        if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight)
    }
    return restoreOldStyle
}

function JSEvents_requestFullscreen(target, strategy) {
    if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
        JSEvents_resizeCanvasForFullscreen(target, strategy)
    }
    if (target.requestFullscreen) {
        target.requestFullscreen()
    } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    } else {
        return JSEvents.fullscreenEnabled() ? -3 : -1
    }
    currentFullscreenStrategy = strategy;
    if (strategy.canvasResizedCallback) {
        ((a1, a2, a3) => dynCall_iiii.apply(null, [strategy.canvasResizedCallback, a1, a2, a3]))(37, 0, strategy.canvasResizedCallbackUserData)
    }
    return 0
}

function _emscripten_exit_fullscreen() {
    if (!JSEvents.fullscreenEnabled()) return -1;
    JSEvents.removeDeferredCalls(JSEvents_requestFullscreen);
    var d = specialHTMLTargets[1];
    if (d.exitFullscreen) {
        d.fullscreenElement && d.exitFullscreen()
    } else if (d.webkitExitFullscreen) {
        d.webkitFullscreenElement && d.webkitExitFullscreen()
    } else {
        return -1
    }
    return 0
}

function requestPointerLock(target) {
    if (target.requestPointerLock) {
        target.requestPointerLock()
    } else {
        if (document.body.requestPointerLock) {
            return -3
        }
        return -1
    }
    return 0
}

function _emscripten_exit_pointerlock() {
    JSEvents.removeDeferredCalls(requestPointerLock);
    if (document.exitPointerLock) {
        document.exitPointerLock()
    } else {
        return -1
    }
    return 0
}

function _emscripten_get_device_pixel_ratio() {
    return typeof devicePixelRatio == "number" && devicePixelRatio || 1
}

function _emscripten_get_element_css_size(target, width, height) {
    target = findEventTarget(target);
    if (!target) return -4;
    var rect = getBoundingClientRect(target);
    HEAPF64[width >>> 3] = rect.width;
    HEAPF64[height >>> 3] = rect.height;
    return 0
}

function fillGamepadEventData(eventStruct, e) {
    HEAPF64[eventStruct >>> 3] = e.timestamp;
    for (var i = 0; i < e.axes.length; ++i) {
        HEAPF64[eventStruct + i * 8 + 16 >>> 3] = e.axes[i]
    }
    for (var i = 0; i < e.buttons.length; ++i) {
        if (typeof e.buttons[i] == "object") {
            HEAPF64[eventStruct + i * 8 + 528 >>> 3] = e.buttons[i].value
        } else {
            HEAPF64[eventStruct + i * 8 + 528 >>> 3] = e.buttons[i]
        }
    }
    for (var i = 0; i < e.buttons.length; ++i) {
        if (typeof e.buttons[i] == "object") {
            HEAP32[eventStruct + i * 4 + 1040 >>> 2] = e.buttons[i].pressed
        } else {
            HEAP32[eventStruct + i * 4 + 1040 >>> 2] = e.buttons[i] == 1
        }
    }
    HEAP32[eventStruct + 1296 >>> 2] = e.connected;
    HEAP32[eventStruct + 1300 >>> 2] = e.index;
    HEAP32[eventStruct + 8 >>> 2] = e.axes.length;
    HEAP32[eventStruct + 12 >>> 2] = e.buttons.length;
    stringToUTF8(e.id, eventStruct + 1304, 64);
    stringToUTF8(e.mapping, eventStruct + 1368, 64)
}

function _emscripten_get_gamepad_status(index, gamepadState) {
    if (!JSEvents.lastGamepadState) throw "emscripten_get_gamepad_status() can only be called after having first called emscripten_sample_gamepad_data() and that function has returned EMSCRIPTEN_RESULT_SUCCESS!";
    if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
    if (!JSEvents.lastGamepadState[index]) return -7;
    fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
    return 0
}

function _emscripten_get_num_gamepads() {
    if (!JSEvents.lastGamepadState) throw "emscripten_get_num_gamepads() can only be called after having first called emscripten_sample_gamepad_data() and that function has returned EMSCRIPTEN_RESULT_SUCCESS!";
    return JSEvents.lastGamepadState.length
}

function _emscripten_get_screen_size(width, height) {
    HEAP32[width >>> 2] = screen.width;
    HEAP32[height >>> 2] = screen.height
}

function _glActiveTexture(x0) {
    GLctx.activeTexture(x0)
}
var _emscripten_glActiveTexture = _glActiveTexture;

function _glAttachShader(program, shader) {
    GLctx.attachShader(GL.programs[program], GL.shaders[shader])
}
var _emscripten_glAttachShader = _glAttachShader;

function _glBeginQuery(target, id) {
    GLctx.beginQuery(target, GL.queries[id])
}
var _emscripten_glBeginQuery = _glBeginQuery;

function _glBeginQueryEXT(target, id) {
    GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.queries[id])
}
var _emscripten_glBeginQueryEXT = _glBeginQueryEXT;

function _glBeginTransformFeedback(x0) {
    GLctx.beginTransformFeedback(x0)
}
var _emscripten_glBeginTransformFeedback = _glBeginTransformFeedback;

function _glBindAttribLocation(program, index, name) {
    GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name))
}
var _emscripten_glBindAttribLocation = _glBindAttribLocation;

function _glBindBuffer(target, buffer) {
    if (target == 34962) {
        GLctx.currentArrayBufferBinding = buffer
    } else if (target == 34963) {
        GLctx.currentElementArrayBufferBinding = buffer
    }
    if (target == 35051) {
        GLctx.currentPixelPackBufferBinding = buffer
    } else if (target == 35052) {
        GLctx.currentPixelUnpackBufferBinding = buffer
    }
    GLctx.bindBuffer(target, GL.buffers[buffer])
}
var _emscripten_glBindBuffer = _glBindBuffer;

function _glBindBufferBase(target, index, buffer) {
    GLctx.bindBufferBase(target, index, GL.buffers[buffer])
}
var _emscripten_glBindBufferBase = _glBindBufferBase;

function _glBindBufferRange(target, index, buffer, offset, ptrsize) {
    GLctx.bindBufferRange(target, index, GL.buffers[buffer], offset, ptrsize)
}
var _emscripten_glBindBufferRange = _glBindBufferRange;

function _glBindFramebuffer(target, framebuffer) {
    GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer])
}
var _emscripten_glBindFramebuffer = _glBindFramebuffer;

function _glBindRenderbuffer(target, renderbuffer) {
    GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer])
}
var _emscripten_glBindRenderbuffer = _glBindRenderbuffer;

function _glBindSampler(unit, sampler) {
    GLctx.bindSampler(unit, GL.samplers[sampler])
}
var _emscripten_glBindSampler = _glBindSampler;

function _glBindTexture(target, texture) {
    GLctx.bindTexture(target, GL.textures[texture])
}
var _emscripten_glBindTexture = _glBindTexture;

function _glBindTransformFeedback(target, id) {
    GLctx.bindTransformFeedback(target, GL.transformFeedbacks[id])
}
var _emscripten_glBindTransformFeedback = _glBindTransformFeedback;

function _glBindVertexArray(vao) {
    GLctx.bindVertexArray(GL.vaos[vao]);
    var ibo = GLctx.getParameter(34965);
    GLctx.currentElementArrayBufferBinding = ibo ? ibo.name | 0 : 0
}
var _emscripten_glBindVertexArray = _glBindVertexArray;
var _glBindVertexArrayOES = _glBindVertexArray;
var _emscripten_glBindVertexArrayOES = _glBindVertexArrayOES;

function _glBlendColor(x0, x1, x2, x3) {
    GLctx.blendColor(x0, x1, x2, x3)
}
var _emscripten_glBlendColor = _glBlendColor;

function _glBlendEquation(x0) {
    GLctx.blendEquation(x0)
}
var _emscripten_glBlendEquation = _glBlendEquation;

function _glBlendEquationSeparate(x0, x1) {
    GLctx.blendEquationSeparate(x0, x1)
}
var _emscripten_glBlendEquationSeparate = _glBlendEquationSeparate;

function _glBlendFunc(x0, x1) {
    GLctx.blendFunc(x0, x1)
}
var _emscripten_glBlendFunc = _glBlendFunc;

function _glBlendFuncSeparate(x0, x1, x2, x3) {
    GLctx.blendFuncSeparate(x0, x1, x2, x3)
}
var _emscripten_glBlendFuncSeparate = _glBlendFuncSeparate;

function _glBlitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) {
    GLctx.blitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9)
}
var _emscripten_glBlitFramebuffer = _glBlitFramebuffer;

function _glBufferData(target, size, data, usage) {
    if (true) {
        if (data && size) {
            GLctx.bufferData(target, HEAPU8, usage, data, size)
        } else {
            GLctx.bufferData(target, size, usage)
        }
    } else {
        GLctx.bufferData(target, data ? HEAPU8.subarray(data >>> 0, data + size >>> 0) : size, usage)
    }
}
var _emscripten_glBufferData = _glBufferData;

function _glBufferSubData(target, offset, size, data) {
    if (true) {
        size && GLctx.bufferSubData(target, offset, HEAPU8, data, size);
        return
    }
    GLctx.bufferSubData(target, offset, HEAPU8.subarray(data >>> 0, data + size >>> 0))
}
var _emscripten_glBufferSubData = _glBufferSubData;

function _glCheckFramebufferStatus(x0) {
    return GLctx.checkFramebufferStatus(x0)
}
var _emscripten_glCheckFramebufferStatus = _glCheckFramebufferStatus;

function _glClear(x0) {
    GLctx.clear(x0)
}
var _emscripten_glClear = _glClear;

function _glClearBufferfi(x0, x1, x2, x3) {
    GLctx.clearBufferfi(x0, x1, x2, x3)
}
var _emscripten_glClearBufferfi = _glClearBufferfi;

function _glClearBufferfv(buffer, drawbuffer, value) {
    GLctx.clearBufferfv(buffer, drawbuffer, HEAPF32, value >> 2)
}
var _emscripten_glClearBufferfv = _glClearBufferfv;

function _glClearBufferiv(buffer, drawbuffer, value) {
    GLctx.clearBufferiv(buffer, drawbuffer, HEAP32, value >> 2)
}
var _emscripten_glClearBufferiv = _glClearBufferiv;

function _glClearBufferuiv(buffer, drawbuffer, value) {
    GLctx.clearBufferuiv(buffer, drawbuffer, HEAPU32, value >> 2)
}
var _emscripten_glClearBufferuiv = _glClearBufferuiv;

function _glClearColor(x0, x1, x2, x3) {
    GLctx.clearColor(x0, x1, x2, x3)
}
var _emscripten_glClearColor = _glClearColor;

function _glClearDepthf(x0) {
    GLctx.clearDepth(x0)
}
var _emscripten_glClearDepthf = _glClearDepthf;

function _glClearStencil(x0) {
    GLctx.clearStencil(x0)
}
var _emscripten_glClearStencil = _glClearStencil;

function convertI32PairToI53(lo, hi) {
    assert(hi === (hi | 0));
    return (lo >>> 0) + hi * 4294967296
}

function _glClientWaitSync(sync, flags, timeout_low, timeout_high) {
    var timeout = convertI32PairToI53(timeout_low, timeout_high);
    return GLctx.clientWaitSync(GL.syncs[sync], flags, timeout)
}
var _emscripten_glClientWaitSync = _glClientWaitSync;

function _glColorMask(red, green, blue, alpha) {
    GLctx.colorMask(!!red, !!green, !!blue, !!alpha)
}
var _emscripten_glColorMask = _glColorMask;

function _glCompileShader(shader) {
    GLctx.compileShader(GL.shaders[shader])
}
var _emscripten_glCompileShader = _glCompileShader;

function _glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
    if (true) {
        if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
            GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data)
        } else {
            GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, HEAPU8, data, imageSize)
        }
        return
    }
    GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data >>> 0, data + imageSize >>> 0) : null)
}
var _emscripten_glCompressedTexImage2D = _glCompressedTexImage2D;

function _glCompressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize, data) {
    if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize, data)
    } else {
        GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, HEAPU8, data, imageSize)
    }
}
var _emscripten_glCompressedTexImage3D = _glCompressedTexImage3D;

function _glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
    if (true) {
        if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
            GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data)
        } else {
            GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, HEAPU8, data, imageSize)
        }
        return
    }
    GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(data >>> 0, data + imageSize >>> 0) : null)
}
var _emscripten_glCompressedTexSubImage2D = _glCompressedTexSubImage2D;

function _glCompressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data) {
    if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data)
    } else {
        GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, HEAPU8, data, imageSize)
    }
}
var _emscripten_glCompressedTexSubImage3D = _glCompressedTexSubImage3D;

function _glCopyBufferSubData(x0, x1, x2, x3, x4) {
    GLctx.copyBufferSubData(x0, x1, x2, x3, x4)
}
var _emscripten_glCopyBufferSubData = _glCopyBufferSubData;

function _glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
    GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7)
}
var _emscripten_glCopyTexImage2D = _glCopyTexImage2D;

function _glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
    GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7)
}
var _emscripten_glCopyTexSubImage2D = _glCopyTexSubImage2D;

function _glCopyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8) {
    GLctx.copyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8)
}
var _emscripten_glCopyTexSubImage3D = _glCopyTexSubImage3D;

function _glCreateProgram() {
    var id = GL.getNewId(GL.programs);
    var program = GLctx.createProgram();
    program.name = id;
    program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
    program.uniformIdCounter = 1;
    GL.programs[id] = program;
    return id
}
var _emscripten_glCreateProgram = _glCreateProgram;

function _glCreateShader(shaderType) {
    var id = GL.getNewId(GL.shaders);
    GL.shaders[id] = GLctx.createShader(shaderType);
    return id
}
var _emscripten_glCreateShader = _glCreateShader;

function _glCullFace(x0) {
    GLctx.cullFace(x0)
}
var _emscripten_glCullFace = _glCullFace;

function _glDeleteBuffers(n, buffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[buffers + i * 4 >>> 2];
        var buffer = GL.buffers[id];
        if (!buffer) continue;
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
        if (id == GLctx.currentArrayBufferBinding) GLctx.currentArrayBufferBinding = 0;
        if (id == GLctx.currentElementArrayBufferBinding) GLctx.currentElementArrayBufferBinding = 0;
        if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
        if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0
    }
}
var _emscripten_glDeleteBuffers = _glDeleteBuffers;

function _glDeleteFramebuffers(n, framebuffers) {
    for (var i = 0; i < n; ++i) {
        var id = HEAP32[framebuffers + i * 4 >>> 2];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue;
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null
    }
}
var _emscripten_glDeleteFramebuffers = _glDeleteFramebuffers;

function _glDeleteProgram(id) {
    if (!id) return;
    var program = GL.programs[id];
    if (!program) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteProgram(program);
    program.name = 0;
    GL.programs[id] = null
}
var _emscripten_glDeleteProgram = _glDeleteProgram;

function _glDeleteQueries(n, ids) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[ids + i * 4 >>> 2];
        var query = GL.queries[id];
        if (!query) continue;
        GLctx.deleteQuery(query);
        GL.queries[id] = null
    }
}
var _emscripten_glDeleteQueries = _glDeleteQueries;

function _glDeleteQueriesEXT(n, ids) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[ids + i * 4 >>> 2];
        var query = GL.queries[id];
        if (!query) continue;
        GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
        GL.queries[id] = null
    }
}
var _emscripten_glDeleteQueriesEXT = _glDeleteQueriesEXT;

function _glDeleteRenderbuffers(n, renderbuffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[renderbuffers + i * 4 >>> 2];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue;
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null
    }
}
var _emscripten_glDeleteRenderbuffers = _glDeleteRenderbuffers;

function _glDeleteSamplers(n, samplers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[samplers + i * 4 >>> 2];
        var sampler = GL.samplers[id];
        if (!sampler) continue;
        GLctx.deleteSampler(sampler);
        sampler.name = 0;
        GL.samplers[id] = null
    }
}
var _emscripten_glDeleteSamplers = _glDeleteSamplers;

function _glDeleteShader(id) {
    if (!id) return;
    var shader = GL.shaders[id];
    if (!shader) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteShader(shader);
    GL.shaders[id] = null
}
var _emscripten_glDeleteShader = _glDeleteShader;

function _glDeleteSync(id) {
    if (!id) return;
    var sync = GL.syncs[id];
    if (!sync) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteSync(sync);
    sync.name = 0;
    GL.syncs[id] = null
}
var _emscripten_glDeleteSync = _glDeleteSync;

function _glDeleteTextures(n, textures) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[textures + i * 4 >>> 2];
        var texture = GL.textures[id];
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null
    }
}
var _emscripten_glDeleteTextures = _glDeleteTextures;

function _glDeleteTransformFeedbacks(n, ids) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[ids + i * 4 >>> 2];
        var transformFeedback = GL.transformFeedbacks[id];
        if (!transformFeedback) continue;
        GLctx.deleteTransformFeedback(transformFeedback);
        transformFeedback.name = 0;
        GL.transformFeedbacks[id] = null
    }
}
var _emscripten_glDeleteTransformFeedbacks = _glDeleteTransformFeedbacks;

function _glDeleteVertexArrays(n, vaos) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[vaos + i * 4 >>> 2];
        GLctx.deleteVertexArray(GL.vaos[id]);
        GL.vaos[id] = null
    }
}
var _emscripten_glDeleteVertexArrays = _glDeleteVertexArrays;
var _glDeleteVertexArraysOES = _glDeleteVertexArrays;
var _emscripten_glDeleteVertexArraysOES = _glDeleteVertexArraysOES;

function _glDepthFunc(x0) {
    GLctx.depthFunc(x0)
}
var _emscripten_glDepthFunc = _glDepthFunc;

function _glDepthMask(flag) {
    GLctx.depthMask(!!flag)
}
var _emscripten_glDepthMask = _glDepthMask;

function _glDepthRangef(x0, x1) {
    GLctx.depthRange(x0, x1)
}
var _emscripten_glDepthRangef = _glDepthRangef;

function _glDetachShader(program, shader) {
    GLctx.detachShader(GL.programs[program], GL.shaders[shader])
}
var _emscripten_glDetachShader = _glDetachShader;

function _glDisable(x0) {
    GLctx.disable(x0)
}
var _emscripten_glDisable = _glDisable;

function _glDisableVertexAttribArray(index) {
    var cb = GL.currentContext.clientBuffers[index];
    cb.enabled = false;
    GLctx.disableVertexAttribArray(index)
}
var _emscripten_glDisableVertexAttribArray = _glDisableVertexAttribArray;

function _glDrawArrays(mode, first, count) {
    GL.preDrawHandleClientVertexAttribBindings(first + count);
    GLctx.drawArrays(mode, first, count);
    GL.postDrawHandleClientVertexAttribBindings()
}
var _emscripten_glDrawArrays = _glDrawArrays;

function _glDrawArraysInstanced(mode, first, count, primcount) {
    GLctx.drawArraysInstanced(mode, first, count, primcount)
}
var _emscripten_glDrawArraysInstanced = _glDrawArraysInstanced;
var _glDrawArraysInstancedANGLE = _glDrawArraysInstanced;
var _emscripten_glDrawArraysInstancedANGLE = _glDrawArraysInstancedANGLE;
var _glDrawArraysInstancedARB = _glDrawArraysInstanced;
var _emscripten_glDrawArraysInstancedARB = _glDrawArraysInstancedARB;
var _glDrawArraysInstancedEXT = _glDrawArraysInstanced;
var _emscripten_glDrawArraysInstancedEXT = _glDrawArraysInstancedEXT;
var _glDrawArraysInstancedNV = _glDrawArraysInstanced;
var _emscripten_glDrawArraysInstancedNV = _glDrawArraysInstancedNV;
var tempFixedLengthArray = [];

function _glDrawBuffers(n, bufs) {
    var bufArray = tempFixedLengthArray[n];
    for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[bufs + i * 4 >>> 2]
    }
    GLctx.drawBuffers(bufArray)
}
var _emscripten_glDrawBuffers = _glDrawBuffers;
var _glDrawBuffersEXT = _glDrawBuffers;
var _emscripten_glDrawBuffersEXT = _glDrawBuffersEXT;
var _glDrawBuffersWEBGL = _glDrawBuffers;
var _emscripten_glDrawBuffersWEBGL = _glDrawBuffersWEBGL;

function _glDrawElements(mode, count, type, indices) {
    var buf;
    if (!GLctx.currentElementArrayBufferBinding) {
        var size = GL.calcBufLength(1, type, 0, count);
        buf = GL.getTempIndexBuffer(size);
        GLctx.bindBuffer(34963, buf);
        GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices >>> 0, indices + size >>> 0));
        indices = 0
    }
    GL.preDrawHandleClientVertexAttribBindings(count);
    GLctx.drawElements(mode, count, type, indices);
    GL.postDrawHandleClientVertexAttribBindings(count);
    if (!GLctx.currentElementArrayBufferBinding) {
        GLctx.bindBuffer(34963, null)
    }
}
var _emscripten_glDrawElements = _glDrawElements;

function _glDrawElementsInstanced(mode, count, type, indices, primcount) {
    GLctx.drawElementsInstanced(mode, count, type, indices, primcount)
}
var _emscripten_glDrawElementsInstanced = _glDrawElementsInstanced;
var _glDrawElementsInstancedANGLE = _glDrawElementsInstanced;
var _emscripten_glDrawElementsInstancedANGLE = _glDrawElementsInstancedANGLE;
var _glDrawElementsInstancedARB = _glDrawElementsInstanced;
var _emscripten_glDrawElementsInstancedARB = _glDrawElementsInstancedARB;
var _glDrawElementsInstancedEXT = _glDrawElementsInstanced;
var _emscripten_glDrawElementsInstancedEXT = _glDrawElementsInstancedEXT;
var _glDrawElementsInstancedNV = _glDrawElementsInstanced;
var _emscripten_glDrawElementsInstancedNV = _glDrawElementsInstancedNV;

function _glDrawRangeElements(mode, start, end, count, type, indices) {
    _glDrawElements(mode, count, type, indices)
}
var _emscripten_glDrawRangeElements = _glDrawRangeElements;

function _glEnable(x0) {
    GLctx.enable(x0)
}
var _emscripten_glEnable = _glEnable;

function _glEnableVertexAttribArray(index) {
    var cb = GL.currentContext.clientBuffers[index];
    cb.enabled = true;
    GLctx.enableVertexAttribArray(index)
}
var _emscripten_glEnableVertexAttribArray = _glEnableVertexAttribArray;

function _glEndQuery(x0) {
    GLctx.endQuery(x0)
}
var _emscripten_glEndQuery = _glEndQuery;

function _glEndQueryEXT(target) {
    GLctx.disjointTimerQueryExt["endQueryEXT"](target)
}
var _emscripten_glEndQueryEXT = _glEndQueryEXT;

function _glEndTransformFeedback() {
    GLctx.endTransformFeedback()
}
var _emscripten_glEndTransformFeedback = _glEndTransformFeedback;

function _glFenceSync(condition, flags) {
    var sync = GLctx.fenceSync(condition, flags);
    if (sync) {
        var id = GL.getNewId(GL.syncs);
        sync.name = id;
        GL.syncs[id] = sync;
        return id
    }
    return 0
}
var _emscripten_glFenceSync = _glFenceSync;

function _glFinish() {
    GLctx.finish()
}
var _emscripten_glFinish = _glFinish;

function _glFlush() {
    GLctx.flush()
}
var _emscripten_glFlush = _glFlush;

function emscriptenWebGLGetBufferBinding(target) {
    switch (target) {
        case 34962:
            target = 34964;
            break;
        case 34963:
            target = 34965;
            break;
        case 35051:
            target = 35053;
            break;
        case 35052:
            target = 35055;
            break;
        case 35982:
            target = 35983;
            break;
        case 36662:
            target = 36662;
            break;
        case 36663:
            target = 36663;
            break;
        case 35345:
            target = 35368;
            break
    }
    var buffer = GLctx.getParameter(target);
    if (buffer) return buffer.name | 0;
    else return 0
}

function emscriptenWebGLValidateMapBufferTarget(target) {
    switch (target) {
        case 34962:
        case 34963:
        case 36662:
        case 36663:
        case 35051:
        case 35052:
        case 35882:
        case 35982:
        case 35345:
            return true;
        default:
            return false
    }
}

function _glFlushMappedBufferRange(target, offset, length) {
    if (!emscriptenWebGLValidateMapBufferTarget(target)) {
        GL.recordError(1280);
        err("GL_INVALID_ENUM in glFlushMappedBufferRange");
        return
    }
    var mapping = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];
    if (!mapping) {
        GL.recordError(1282);
        err("buffer was never mapped in glFlushMappedBufferRange");
        return
    }
    if (!(mapping.access & 16)) {
        GL.recordError(1282);
        err("buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange");
        return
    }
    if (offset < 0 || length < 0 || offset + length > mapping.length) {
        GL.recordError(1281);
        err("invalid range in glFlushMappedBufferRange");
        return
    }
    GLctx.bufferSubData(target, mapping.offset, HEAPU8.subarray(mapping.mem + offset >>> 0, mapping.mem + offset + length >>> 0))
}
var _emscripten_glFlushMappedBufferRange = _glFlushMappedBufferRange;

function _glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
    GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer])
}
var _emscripten_glFramebufferRenderbuffer = _glFramebufferRenderbuffer;

function _glFramebufferTexture2D(target, attachment, textarget, texture, level) {
    GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level)
}
var _emscripten_glFramebufferTexture2D = _glFramebufferTexture2D;

function _glFramebufferTextureLayer(target, attachment, texture, level, layer) {
    GLctx.framebufferTextureLayer(target, attachment, GL.textures[texture], level, layer)
}
var _emscripten_glFramebufferTextureLayer = _glFramebufferTextureLayer;

function _glFrontFace(x0) {
    GLctx.frontFace(x0)
}
var _emscripten_glFrontFace = _glFrontFace;

function __glGenObject(n, buffers, createFunction, objectTable) {
    for (var i = 0; i < n; i++) {
        var buffer = GLctx[createFunction]();
        var id = buffer && GL.getNewId(objectTable);
        if (buffer) {
            buffer.name = id;
            objectTable[id] = buffer
        } else {
            GL.recordError(1282)
        }
        HEAP32[buffers + i * 4 >>> 2] = id
    }
}

function _glGenBuffers(n, buffers) {
    __glGenObject(n, buffers, "createBuffer", GL.buffers)
}
var _emscripten_glGenBuffers = _glGenBuffers;

function _glGenFramebuffers(n, ids) {
    __glGenObject(n, ids, "createFramebuffer", GL.framebuffers)
}
var _emscripten_glGenFramebuffers = _glGenFramebuffers;

function _glGenQueries(n, ids) {
    __glGenObject(n, ids, "createQuery", GL.queries)
}
var _emscripten_glGenQueries = _glGenQueries;

function _glGenQueriesEXT(n, ids) {
    for (var i = 0; i < n; i++) {
        var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
        if (!query) {
            GL.recordError(1282);
            while (i < n) HEAP32[ids + i++ * 4 >>> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.queries);
        query.name = id;
        GL.queries[id] = query;
        HEAP32[ids + i * 4 >>> 2] = id
    }
}
var _emscripten_glGenQueriesEXT = _glGenQueriesEXT;

function _glGenRenderbuffers(n, renderbuffers) {
    __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers)
}
var _emscripten_glGenRenderbuffers = _glGenRenderbuffers;

function _glGenSamplers(n, samplers) {
    __glGenObject(n, samplers, "createSampler", GL.samplers)
}
var _emscripten_glGenSamplers = _glGenSamplers;

function _glGenTextures(n, textures) {
    __glGenObject(n, textures, "createTexture", GL.textures)
}
var _emscripten_glGenTextures = _glGenTextures;

function _glGenTransformFeedbacks(n, ids) {
    __glGenObject(n, ids, "createTransformFeedback", GL.transformFeedbacks)
}
var _emscripten_glGenTransformFeedbacks = _glGenTransformFeedbacks;

function _glGenVertexArrays(n, arrays) {
    __glGenObject(n, arrays, "createVertexArray", GL.vaos)
}
var _emscripten_glGenVertexArrays = _glGenVertexArrays;
var _glGenVertexArraysOES = _glGenVertexArrays;
var _emscripten_glGenVertexArraysOES = _glGenVertexArraysOES;

function _glGenerateMipmap(x0) {
    GLctx.generateMipmap(x0)
}
var _emscripten_glGenerateMipmap = _glGenerateMipmap;

function __glGetActiveAttribOrUniform(funcName, program, index, bufSize, length, size, type, name) {
    program = GL.programs[program];
    var info = GLctx[funcName](program, index);
    if (info) {
        var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[length >>> 2] = numBytesWrittenExclNull;
        if (size) HEAP32[size >>> 2] = info.size;
        if (type) HEAP32[type >>> 2] = info.type
    }
}

function _glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
    __glGetActiveAttribOrUniform("getActiveAttrib", program, index, bufSize, length, size, type, name)
}
var _emscripten_glGetActiveAttrib = _glGetActiveAttrib;

function _glGetActiveUniform(program, index, bufSize, length, size, type, name) {
    __glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type, name)
}
var _emscripten_glGetActiveUniform = _glGetActiveUniform;

function _glGetActiveUniformBlockName(program, uniformBlockIndex, bufSize, length, uniformBlockName) {
    program = GL.programs[program];
    var result = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
    if (!result) return;
    if (uniformBlockName && bufSize > 0) {
        var numBytesWrittenExclNull = stringToUTF8(result, uniformBlockName, bufSize);
        if (length) HEAP32[length >>> 2] = numBytesWrittenExclNull
    } else {
        if (length) HEAP32[length >>> 2] = 0
    }
}
var _emscripten_glGetActiveUniformBlockName = _glGetActiveUniformBlockName;

function _glGetActiveUniformBlockiv(program, uniformBlockIndex, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    if (pname == 35393) {
        var name = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
        HEAP32[params >>> 2] = name.length + 1;
        return
    }
    var result = GLctx.getActiveUniformBlockParameter(program, uniformBlockIndex, pname);
    if (result === null) return;
    if (pname == 35395) {
        for (var i = 0; i < result.length; i++) {
            HEAP32[params + i * 4 >>> 2] = result[i]
        }
    } else {
        HEAP32[params >>> 2] = result
    }
}
var _emscripten_glGetActiveUniformBlockiv = _glGetActiveUniformBlockiv;

function _glGetActiveUniformsiv(program, uniformCount, uniformIndices, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    if (uniformCount > 0 && uniformIndices == 0) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    var ids = [];
    for (var i = 0; i < uniformCount; i++) {
        ids.push(HEAP32[uniformIndices + i * 4 >>> 2])
    }
    var result = GLctx.getActiveUniforms(program, ids, pname);
    if (!result) return;
    var len = result.length;
    for (var i = 0; i < len; i++) {
        HEAP32[params + i * 4 >>> 2] = result[i]
    }
}
var _emscripten_glGetActiveUniformsiv = _glGetActiveUniformsiv;

function _glGetAttachedShaders(program, maxCount, count, shaders) {
    var result = GLctx.getAttachedShaders(GL.programs[program]);
    var len = result.length;
    if (len > maxCount) {
        len = maxCount
    }
    HEAP32[count >>> 2] = len;
    for (var i = 0; i < len; ++i) {
        var id = GL.shaders.indexOf(result[i]);
        HEAP32[shaders + i * 4 >>> 2] = id
    }
}
var _emscripten_glGetAttachedShaders = _glGetAttachedShaders;

function _glGetAttribLocation(program, name) {
    return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name))
}
var _emscripten_glGetAttribLocation = _glGetAttribLocation;

function readI53FromI64(ptr) {
    return HEAPU32[ptr >>> 2] + HEAP32[ptr + 4 >>> 2] * 4294967296
}

function readI53FromU64(ptr) {
    return HEAPU32[ptr >>> 2] + HEAPU32[ptr + 4 >>> 2] * 4294967296
}

function writeI53ToI64(ptr, num) {
    HEAPU32[ptr >>> 2] = num;
    HEAPU32[ptr + 4 >>> 2] = (num - HEAPU32[ptr >>> 2]) / 4294967296;
    var deserialized = num >= 0 ? readI53FromU64(ptr) : readI53FromI64(ptr);
    if (deserialized != num) warnOnce("writeI53ToI64() out of range: serialized JS Number " + num + " to Wasm heap as bytes lo=" + ptrToString(HEAPU32[ptr >>> 2]) + ", hi=" + ptrToString(HEAPU32[ptr + 4 >>> 2]) + ", which deserializes back to " + deserialized + " instead!")
}

function emscriptenWebGLGet(name_, p, type) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    var ret = undefined;
    switch (name_) {
        case 36346:
            ret = 1;
            break;
        case 36344:
            if (type != 0 && type != 1) {
                GL.recordError(1280)
            }
            return;
        case 34814:
        case 36345:
            ret = 0;
            break;
        case 34466:
            var formats = GLctx.getParameter(34467);
            ret = formats ? formats.length : 0;
            break;
        case 33309:
            if (GL.currentContext.version < 2) {
                GL.recordError(1282);
                return
            }
            var exts = GLctx.getSupportedExtensions() || [];
            ret = 2 * exts.length;
            break;
        case 33307:
        case 33308:
            if (GL.currentContext.version < 2) {
                GL.recordError(1280);
                return
            }
            ret = name_ == 33307 ? 3 : 0;
            break
    }
    if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
            case "number":
                ret = result;
                break;
            case "boolean":
                ret = result ? 1 : 0;
                break;
            case "string":
                GL.recordError(1280);
                return;
            case "object":
                if (result === null) {
                    switch (name_) {
                        case 34964:
                        case 35725:
                        case 34965:
                        case 36006:
                        case 36007:
                        case 32873:
                        case 34229:
                        case 36662:
                        case 36663:
                        case 35053:
                        case 35055:
                        case 36010:
                        case 35097:
                        case 35869:
                        case 32874:
                        case 36389:
                        case 35983:
                        case 35368:
                        case 34068: {
                            ret = 0;
                            break
                        }
                        default: {
                            GL.recordError(1280);
                            return
                        }
                    }
                } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
                    for (var i = 0; i < result.length; ++i) {
                        switch (type) {
                            case 0:
                                HEAP32[p + i * 4 >>> 2] = result[i];
                                break;
                            case 2:
                                HEAPF32[p + i * 4 >>> 2] = result[i];
                                break;
                            case 4:
                                HEAP8[p + i >>> 0] = result[i] ? 1 : 0;
                                break
                        }
                    }
                    return
                } else {
                    try {
                        ret = result.name | 0
                    } catch (e) {
                        GL.recordError(1280);
                        err("GL_INVALID_ENUM in glGet" + type + "v: Unknown object returned from WebGL getParameter(" + name_ + ")! (error: " + e + ")");
                        return
                    }
                }
                break;
            default:
                GL.recordError(1280);
                err("GL_INVALID_ENUM in glGet" + type + "v: Native code calling glGet" + type + "v(" + name_ + ") and it returns " + result + " of type " + typeof result + "!");
                return
        }
    }
    switch (type) {
        case 1:
            writeI53ToI64(p, ret);
            break;
        case 0:
            HEAP32[p >>> 2] = ret;
            break;
        case 2:
            HEAPF32[p >>> 2] = ret;
            break;
        case 4:
            HEAP8[p >>> 0] = ret ? 1 : 0;
            break
    }
}

function _glGetBooleanv(name_, p) {
    emscriptenWebGLGet(name_, p, 4)
}
var _emscripten_glGetBooleanv = _glGetBooleanv;

function _glGetBufferParameteri64v(target, value, data) {
    if (!data) {
        GL.recordError(1281);
        return
    }
    writeI53ToI64(data, GLctx.getBufferParameter(target, value))
}
var _emscripten_glGetBufferParameteri64v = _glGetBufferParameteri64v;

function _glGetBufferParameteriv(target, value, data) {
    if (!data) {
        GL.recordError(1281);
        return
    }
    HEAP32[data >>> 2] = GLctx.getBufferParameter(target, value)
}
var _emscripten_glGetBufferParameteriv = _glGetBufferParameteriv;

function _glGetBufferPointerv(target, pname, params) {
    if (pname == 35005) {
        var ptr = 0;
        var mappedBuffer = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];
        if (mappedBuffer) {
            ptr = mappedBuffer.mem
        }
        HEAP32[params >>> 2] = ptr
    } else {
        GL.recordError(1280);
        err("GL_INVALID_ENUM in glGetBufferPointerv")
    }
}
var _emscripten_glGetBufferPointerv = _glGetBufferPointerv;

function _glGetError() {
    var error = GLctx.getError() || GL.lastError;
    GL.lastError = 0;
    return error
}
var _emscripten_glGetError = _glGetError;

function _glGetFloatv(name_, p) {
    emscriptenWebGLGet(name_, p, 2)
}
var _emscripten_glGetFloatv = _glGetFloatv;

function _glGetFragDataLocation(program, name) {
    return GLctx.getFragDataLocation(GL.programs[program], UTF8ToString(name))
}
var _emscripten_glGetFragDataLocation = _glGetFragDataLocation;

function _glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
    var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
    if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
        result = result.name | 0
    }
    HEAP32[params >>> 2] = result
}
var _emscripten_glGetFramebufferAttachmentParameteriv = _glGetFramebufferAttachmentParameteriv;

function emscriptenWebGLGetIndexed(target, index, data, type) {
    if (!data) {
        GL.recordError(1281);
        return
    }
    var result = GLctx.getIndexedParameter(target, index);
    var ret;
    switch (typeof result) {
        case "boolean":
            ret = result ? 1 : 0;
            break;
        case "number":
            ret = result;
            break;
        case "object":
            if (result === null) {
                switch (target) {
                    case 35983:
                    case 35368:
                        ret = 0;
                        break;
                    default: {
                        GL.recordError(1280);
                        return
                    }
                }
            } else if (result instanceof WebGLBuffer) {
                ret = result.name | 0
            } else {
                GL.recordError(1280);
                return
            }
            break;
        default:
            GL.recordError(1280);
            return
    }
    switch (type) {
        case 1:
            writeI53ToI64(data, ret);
            break;
        case 0:
            HEAP32[data >>> 2] = ret;
            break;
        case 2:
            HEAPF32[data >>> 2] = ret;
            break;
        case 4:
            HEAP8[data >>> 0] = ret ? 1 : 0;
            break;
        default:
            throw "internal emscriptenWebGLGetIndexed() error, bad type: " + type
    }
}

function _glGetInteger64i_v(target, index, data) {
    emscriptenWebGLGetIndexed(target, index, data, 1)
}
var _emscripten_glGetInteger64i_v = _glGetInteger64i_v;

function _glGetInteger64v(name_, p) {
    emscriptenWebGLGet(name_, p, 1)
}
var _emscripten_glGetInteger64v = _glGetInteger64v;

function _glGetIntegeri_v(target, index, data) {
    emscriptenWebGLGetIndexed(target, index, data, 0)
}
var _emscripten_glGetIntegeri_v = _glGetIntegeri_v;

function _glGetIntegerv(name_, p) {
    emscriptenWebGLGet(name_, p, 0)
}
var _emscripten_glGetIntegerv = _glGetIntegerv;

function _glGetInternalformativ(target, internalformat, pname, bufSize, params) {
    if (bufSize < 0) {
        GL.recordError(1281);
        return
    }
    if (!params) {
        GL.recordError(1281);
        return
    }
    var ret = GLctx.getInternalformatParameter(target, internalformat, pname);
    if (ret === null) return;
    for (var i = 0; i < ret.length && i < bufSize; ++i) {
        HEAP32[params + i * 4 >>> 2] = ret[i]
    }
}
var _emscripten_glGetInternalformativ = _glGetInternalformativ;

function _glGetProgramBinary(program, bufSize, length, binaryFormat, binary) {
    GL.recordError(1282)
}
var _emscripten_glGetProgramBinary = _glGetProgramBinary;

function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
    var log = GLctx.getProgramInfoLog(GL.programs[program]);
    if (log === null) log = "(unknown error)";
    var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
    if (length) HEAP32[length >>> 2] = numBytesWrittenExclNull
}
var _emscripten_glGetProgramInfoLog = _glGetProgramInfoLog;

function _glGetProgramiv(program, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (program >= GL.counter) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(program);
        if (log === null) log = "(unknown error)";
        HEAP32[p >>> 2] = log.length + 1
    } else if (pname == 35719) {
        if (!program.maxUniformLength) {
            for (var i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
                program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1)
            }
        }
        HEAP32[p >>> 2] = program.maxUniformLength
    } else if (pname == 35722) {
        if (!program.maxAttributeLength) {
            for (var i = 0; i < GLctx.getProgramParameter(program, 35721); ++i) {
                program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1)
            }
        }
        HEAP32[p >>> 2] = program.maxAttributeLength
    } else if (pname == 35381) {
        if (!program.maxUniformBlockNameLength) {
            for (var i = 0; i < GLctx.getProgramParameter(program, 35382); ++i) {
                program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1)
            }
        }
        HEAP32[p >>> 2] = program.maxUniformBlockNameLength
    } else {
        HEAP32[p >>> 2] = GLctx.getProgramParameter(program, pname)
    }
}
var _emscripten_glGetProgramiv = _glGetProgramiv;

function _glGetQueryObjecti64vEXT(id, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    var query = GL.queries[id];
    var param;
    if (GL.currentContext.version < 2) {
        param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname)
    } else {
        param = GLctx.getQueryParameter(query, pname)
    }
    var ret;
    if (typeof param == "boolean") {
        ret = param ? 1 : 0
    } else {
        ret = param
    }
    writeI53ToI64(params, ret)
}
var _emscripten_glGetQueryObjecti64vEXT = _glGetQueryObjecti64vEXT;

function _glGetQueryObjectivEXT(id, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    var query = GL.queries[id];
    var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
    var ret;
    if (typeof param == "boolean") {
        ret = param ? 1 : 0
    } else {
        ret = param
    }
    HEAP32[params >>> 2] = ret
}
var _emscripten_glGetQueryObjectivEXT = _glGetQueryObjectivEXT;
var _glGetQueryObjectui64vEXT = _glGetQueryObjecti64vEXT;
var _emscripten_glGetQueryObjectui64vEXT = _glGetQueryObjectui64vEXT;

function _glGetQueryObjectuiv(id, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    var query = GL.queries[id];
    var param = GLctx.getQueryParameter(query, pname);
    var ret;
    if (typeof param == "boolean") {
        ret = param ? 1 : 0
    } else {
        ret = param
    }
    HEAP32[params >>> 2] = ret
}
var _emscripten_glGetQueryObjectuiv = _glGetQueryObjectuiv;
var _glGetQueryObjectuivEXT = _glGetQueryObjectivEXT;
var _emscripten_glGetQueryObjectuivEXT = _glGetQueryObjectuivEXT;

function _glGetQueryiv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >>> 2] = GLctx.getQuery(target, pname)
}
var _emscripten_glGetQueryiv = _glGetQueryiv;

function _glGetQueryivEXT(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >>> 2] = GLctx.disjointTimerQueryExt["getQueryEXT"](target, pname)
}
var _emscripten_glGetQueryivEXT = _glGetQueryivEXT;

function _glGetRenderbufferParameteriv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >>> 2] = GLctx.getRenderbufferParameter(target, pname)
}
var _emscripten_glGetRenderbufferParameteriv = _glGetRenderbufferParameteriv;

function _glGetSamplerParameterfv(sampler, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAPF32[params >>> 2] = GLctx.getSamplerParameter(GL.samplers[sampler], pname)
}
var _emscripten_glGetSamplerParameterfv = _glGetSamplerParameterfv;

function _glGetSamplerParameteriv(sampler, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >>> 2] = GLctx.getSamplerParameter(GL.samplers[sampler], pname)
}
var _emscripten_glGetSamplerParameteriv = _glGetSamplerParameteriv;

function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
    if (length) HEAP32[length >>> 2] = numBytesWrittenExclNull
}
var _emscripten_glGetShaderInfoLog = _glGetShaderInfoLog;

function _glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
    var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
    HEAP32[range >>> 2] = result.rangeMin;
    HEAP32[range + 4 >>> 2] = result.rangeMax;
    HEAP32[precision >>> 2] = result.precision
}
var _emscripten_glGetShaderPrecisionFormat = _glGetShaderPrecisionFormat;

function _glGetShaderSource(shader, bufSize, length, source) {
    var result = GLctx.getShaderSource(GL.shaders[shader]);
    if (!result) return;
    var numBytesWrittenExclNull = bufSize > 0 && source ? stringToUTF8(result, source, bufSize) : 0;
    if (length) HEAP32[length >>> 2] = numBytesWrittenExclNull
}
var _emscripten_glGetShaderSource = _glGetShaderSource;

function _glGetShaderiv(shader, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (pname == 35716) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = "(unknown error)";
        var logLength = log ? log.length + 1 : 0;
        HEAP32[p >>> 2] = logLength
    } else if (pname == 35720) {
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        var sourceLength = source ? source.length + 1 : 0;
        HEAP32[p >>> 2] = sourceLength
    } else {
        HEAP32[p >>> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname)
    }
}
var _emscripten_glGetShaderiv = _glGetShaderiv;

function _glGetString(name_) {
    var ret = GL.stringCache[name_];
    if (!ret) {
        switch (name_) {
            case 7939:
                var exts = GLctx.getSupportedExtensions() || [];
                exts = exts.concat(exts.map(function(e) {
                    return "GL_" + e
                }));
                ret = stringToNewUTF8(exts.join(" "));
                break;
            case 7936:
            case 7937:
            case 37445:
            case 37446:
                var s = GLctx.getParameter(name_);
                if (!s) {
                    GL.recordError(1280)
                }
                ret = s && stringToNewUTF8(s);
                break;
            case 7938:
                var glVersion = GLctx.getParameter(7938);
                if (true) glVersion = "OpenGL ES 3.0 (" + glVersion + ")";
                else {
                    glVersion = "OpenGL ES 2.0 (" + glVersion + ")"
                }
                ret = stringToNewUTF8(glVersion);
                break;
            case 35724:
                var glslVersion = GLctx.getParameter(35724);
                var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
                var ver_num = glslVersion.match(ver_re);
                if (ver_num !== null) {
                    if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
                    glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")"
                }
                ret = stringToNewUTF8(glslVersion);
                break;
            default:
                GL.recordError(1280)
        }
        GL.stringCache[name_] = ret
    }
    return ret
}
var _emscripten_glGetString = _glGetString;

function _glGetStringi(name, index) {
    if (GL.currentContext.version < 2) {
        GL.recordError(1282);
        return 0
    }
    var stringiCache = GL.stringiCache[name];
    if (stringiCache) {
        if (index < 0 || index >= stringiCache.length) {
            GL.recordError(1281);
            return 0
        }
        return stringiCache[index]
    }
    switch (name) {
        case 7939:
            var exts = GLctx.getSupportedExtensions() || [];
            exts = exts.concat(exts.map(function(e) {
                return "GL_" + e
            }));
            exts = exts.map(function(e) {
                return stringToNewUTF8(e)
            });
            stringiCache = GL.stringiCache[name] = exts;
            if (index < 0 || index >= stringiCache.length) {
                GL.recordError(1281);
                return 0
            }
            return stringiCache[index];
        default:
            GL.recordError(1280);
            return 0
    }
}
var _emscripten_glGetStringi = _glGetStringi;

function _glGetSynciv(sync, pname, bufSize, length, values) {
    if (bufSize < 0) {
        GL.recordError(1281);
        return
    }
    if (!values) {
        GL.recordError(1281);
        return
    }
    var ret = GLctx.getSyncParameter(GL.syncs[sync], pname);
    if (ret !== null) {
        HEAP32[values >>> 2] = ret;
        if (length) HEAP32[length >>> 2] = 1
    }
}
var _emscripten_glGetSynciv = _glGetSynciv;

function _glGetTexParameterfv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAPF32[params >>> 2] = GLctx.getTexParameter(target, pname)
}
var _emscripten_glGetTexParameterfv = _glGetTexParameterfv;

function _glGetTexParameteriv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >>> 2] = GLctx.getTexParameter(target, pname)
}
var _emscripten_glGetTexParameteriv = _glGetTexParameteriv;

function _glGetTransformFeedbackVarying(program, index, bufSize, length, size, type, name) {
    program = GL.programs[program];
    var info = GLctx.getTransformFeedbackVarying(program, index);
    if (!info) return;
    if (name && bufSize > 0) {
        var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[length >>> 2] = numBytesWrittenExclNull
    } else {
        if (length) HEAP32[length >>> 2] = 0
    }
    if (size) HEAP32[size >>> 2] = info.size;
    if (type) HEAP32[type >>> 2] = info.type
}
var _emscripten_glGetTransformFeedbackVarying = _glGetTransformFeedbackVarying;

function _glGetUniformBlockIndex(program, uniformBlockName) {
    return GLctx.getUniformBlockIndex(GL.programs[program], UTF8ToString(uniformBlockName))
}
var _emscripten_glGetUniformBlockIndex = _glGetUniformBlockIndex;

function _glGetUniformIndices(program, uniformCount, uniformNames, uniformIndices) {
    if (!uniformIndices) {
        GL.recordError(1281);
        return
    }
    if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    var names = [];
    for (var i = 0; i < uniformCount; i++) names.push(UTF8ToString(HEAP32[uniformNames + i * 4 >>> 2]));
    var result = GLctx.getUniformIndices(program, names);
    if (!result) return;
    var len = result.length;
    for (var i = 0; i < len; i++) {
        HEAP32[uniformIndices + i * 4 >>> 2] = result[i]
    }
}
var _emscripten_glGetUniformIndices = _glGetUniformIndices;

function jstoi_q(str) {
    return parseInt(str)
}

function webglGetLeftBracePos(name) {
    return name.slice(-1) == "]" && name.lastIndexOf("[")
}

function webglPrepareUniformLocationsBeforeFirstUse(program) {
    var uniformLocsById = program.uniformLocsById,
        uniformSizeAndIdsByName = program.uniformSizeAndIdsByName,
        i, j;
    if (!uniformLocsById) {
        program.uniformLocsById = uniformLocsById = {};
        program.uniformArrayNamesById = {};
        for (i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
            var u = GLctx.getActiveUniform(program, i);
            var nm = u.name;
            var sz = u.size;
            var lb = webglGetLeftBracePos(nm);
            var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
            var id = program.uniformIdCounter;
            program.uniformIdCounter += sz;
            uniformSizeAndIdsByName[arrayName] = [sz, id];
            for (j = 0; j < sz; ++j) {
                uniformLocsById[id] = j;
                program.uniformArrayNamesById[id++] = arrayName
            }
        }
    }
}

function _glGetUniformLocation(program, name) {
    name = UTF8ToString(name);
    if (program = GL.programs[program]) {
        webglPrepareUniformLocationsBeforeFirstUse(program);
        var uniformLocsById = program.uniformLocsById;
        var arrayIndex = 0;
        var uniformBaseName = name;
        var leftBrace = webglGetLeftBracePos(name);
        if (leftBrace > 0) {
            arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
            uniformBaseName = name.slice(0, leftBrace)
        }
        var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
        if (sizeAndId && arrayIndex < sizeAndId[0]) {
            arrayIndex += sizeAndId[1];
            if (uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name)) {
                return arrayIndex
            }
        }
    } else {
        GL.recordError(1281)
    }
    return -1
}
var _emscripten_glGetUniformLocation = _glGetUniformLocation;

function webglGetUniformLocation(location) {
    var p = GLctx.currentProgram;
    if (p) {
        var webglLoc = p.uniformLocsById[location];
        if (typeof webglLoc == "number") {
            p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? "[" + webglLoc + "]" : ""))
        }
        return webglLoc
    } else {
        GL.recordError(1282)
    }
}

function emscriptenWebGLGetUniform(program, location, params, type) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    program = GL.programs[program];
    webglPrepareUniformLocationsBeforeFirstUse(program);
    var data = GLctx.getUniform(program, webglGetUniformLocation(location));
    if (typeof data == "number" || typeof data == "boolean") {
        switch (type) {
            case 0:
                HEAP32[params >>> 2] = data;
                break;
            case 2:
                HEAPF32[params >>> 2] = data;
                break
        }
    } else {
        for (var i = 0; i < data.length; i++) {
            switch (type) {
                case 0:
                    HEAP32[params + i * 4 >>> 2] = data[i];
                    break;
                case 2:
                    HEAPF32[params + i * 4 >>> 2] = data[i];
                    break
            }
        }
    }
}

function _glGetUniformfv(program, location, params) {
    emscriptenWebGLGetUniform(program, location, params, 2)
}
var _emscripten_glGetUniformfv = _glGetUniformfv;

function _glGetUniformiv(program, location, params) {
    emscriptenWebGLGetUniform(program, location, params, 0)
}
var _emscripten_glGetUniformiv = _glGetUniformiv;

function _glGetUniformuiv(program, location, params) {
    emscriptenWebGLGetUniform(program, location, params, 0)
}
var _emscripten_glGetUniformuiv = _glGetUniformuiv;

function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    if (GL.currentContext.clientBuffers[index].enabled) {
        err("glGetVertexAttrib*v on client-side array: not supported, bad data returned")
    }
    var data = GLctx.getVertexAttrib(index, pname);
    if (pname == 34975) {
        HEAP32[params >>> 2] = data && data["name"]
    } else if (typeof data == "number" || typeof data == "boolean") {
        switch (type) {
            case 0:
                HEAP32[params >>> 2] = data;
                break;
            case 2:
                HEAPF32[params >>> 2] = data;
                break;
            case 5:
                HEAP32[params >>> 2] = Math.fround(data);
                break
        }
    } else {
        for (var i = 0; i < data.length; i++) {
            switch (type) {
                case 0:
                    HEAP32[params + i * 4 >>> 2] = data[i];
                    break;
                case 2:
                    HEAPF32[params + i * 4 >>> 2] = data[i];
                    break;
                case 5:
                    HEAP32[params + i * 4 >>> 2] = Math.fround(data[i]);
                    break
            }
        }
    }
}

function _glGetVertexAttribIiv(index, pname, params) {
    emscriptenWebGLGetVertexAttrib(index, pname, params, 0)
}
var _emscripten_glGetVertexAttribIiv = _glGetVertexAttribIiv;
var _glGetVertexAttribIuiv = _glGetVertexAttribIiv;
var _emscripten_glGetVertexAttribIuiv = _glGetVertexAttribIuiv;

function _glGetVertexAttribPointerv(index, pname, pointer) {
    if (!pointer) {
        GL.recordError(1281);
        return
    }
    if (GL.currentContext.clientBuffers[index].enabled) {
        err("glGetVertexAttribPointer on client-side array: not supported, bad data returned")
    }
    HEAP32[pointer >>> 2] = GLctx.getVertexAttribOffset(index, pname)
}
var _emscripten_glGetVertexAttribPointerv = _glGetVertexAttribPointerv;

function _glGetVertexAttribfv(index, pname, params) {
    emscriptenWebGLGetVertexAttrib(index, pname, params, 2)
}
var _emscripten_glGetVertexAttribfv = _glGetVertexAttribfv;

function _glGetVertexAttribiv(index, pname, params) {
    emscriptenWebGLGetVertexAttrib(index, pname, params, 5)
}
var _emscripten_glGetVertexAttribiv = _glGetVertexAttribiv;

function _glHint(x0, x1) {
    GLctx.hint(x0, x1)
}
var _emscripten_glHint = _glHint;

function _glInvalidateFramebuffer(target, numAttachments, attachments) {
    var list = tempFixedLengthArray[numAttachments];
    for (var i = 0; i < numAttachments; i++) {
        list[i] = HEAP32[attachments + i * 4 >>> 2]
    }
    GLctx.invalidateFramebuffer(target, list)
}
var _emscripten_glInvalidateFramebuffer = _glInvalidateFramebuffer;

function _glInvalidateSubFramebuffer(target, numAttachments, attachments, x, y, width, height) {
    var list = tempFixedLengthArray[numAttachments];
    for (var i = 0; i < numAttachments; i++) {
        list[i] = HEAP32[attachments + i * 4 >>> 2]
    }
    GLctx.invalidateSubFramebuffer(target, list, x, y, width, height)
}
var _emscripten_glInvalidateSubFramebuffer = _glInvalidateSubFramebuffer;

function _glIsBuffer(buffer) {
    var b = GL.buffers[buffer];
    if (!b) return 0;
    return GLctx.isBuffer(b)
}
var _emscripten_glIsBuffer = _glIsBuffer;

function _glIsEnabled(x0) {
    return GLctx.isEnabled(x0)
}
var _emscripten_glIsEnabled = _glIsEnabled;

function _glIsFramebuffer(framebuffer) {
    var fb = GL.framebuffers[framebuffer];
    if (!fb) return 0;
    return GLctx.isFramebuffer(fb)
}
var _emscripten_glIsFramebuffer = _glIsFramebuffer;

function _glIsProgram(program) {
    program = GL.programs[program];
    if (!program) return 0;
    return GLctx.isProgram(program)
}
var _emscripten_glIsProgram = _glIsProgram;

function _glIsQuery(id) {
    var query = GL.queries[id];
    if (!query) return 0;
    return GLctx.isQuery(query)
}
var _emscripten_glIsQuery = _glIsQuery;

function _glIsQueryEXT(id) {
    var query = GL.queries[id];
    if (!query) return 0;
    return GLctx.disjointTimerQueryExt["isQueryEXT"](query)
}
var _emscripten_glIsQueryEXT = _glIsQueryEXT;

function _glIsRenderbuffer(renderbuffer) {
    var rb = GL.renderbuffers[renderbuffer];
    if (!rb) return 0;
    return GLctx.isRenderbuffer(rb)
}
var _emscripten_glIsRenderbuffer = _glIsRenderbuffer;

function _glIsSampler(id) {
    var sampler = GL.samplers[id];
    if (!sampler) return 0;
    return GLctx.isSampler(sampler)
}
var _emscripten_glIsSampler = _glIsSampler;

function _glIsShader(shader) {
    var s = GL.shaders[shader];
    if (!s) return 0;
    return GLctx.isShader(s)
}
var _emscripten_glIsShader = _glIsShader;

function _glIsSync(sync) {
    return GLctx.isSync(GL.syncs[sync])
}
var _emscripten_glIsSync = _glIsSync;

function _glIsTexture(id) {
    var texture = GL.textures[id];
    if (!texture) return 0;
    return GLctx.isTexture(texture)
}
var _emscripten_glIsTexture = _glIsTexture;

function _glIsTransformFeedback(id) {
    return GLctx.isTransformFeedback(GL.transformFeedbacks[id])
}
var _emscripten_glIsTransformFeedback = _glIsTransformFeedback;

function _glIsVertexArray(array) {
    var vao = GL.vaos[array];
    if (!vao) return 0;
    return GLctx.isVertexArray(vao)
}
var _emscripten_glIsVertexArray = _glIsVertexArray;
var _glIsVertexArrayOES = _glIsVertexArray;
var _emscripten_glIsVertexArrayOES = _glIsVertexArrayOES;

function _glLineWidth(x0) {
    GLctx.lineWidth(x0)
}
var _emscripten_glLineWidth = _glLineWidth;

function _glLinkProgram(program) {
    program = GL.programs[program];
    GLctx.linkProgram(program);
    program.uniformLocsById = 0;
    program.uniformSizeAndIdsByName = {}
}
var _emscripten_glLinkProgram = _glLinkProgram;

function _glMapBufferRange(target, offset, length, access) {
    if ((access & (1 | 32)) != 0) {
        err("glMapBufferRange access does not support MAP_READ or MAP_UNSYNCHRONIZED");
        return 0
    }
    if ((access & 2) == 0) {
        err("glMapBufferRange access must include MAP_WRITE");
        return 0
    }
    if ((access & (4 | 8)) == 0) {
        err("glMapBufferRange access must include INVALIDATE_BUFFER or INVALIDATE_RANGE");
        return 0
    }
    if (!emscriptenWebGLValidateMapBufferTarget(target)) {
        GL.recordError(1280);
        err("GL_INVALID_ENUM in glMapBufferRange");
        return 0
    }
    var mem = _malloc(length);
    if (!mem) return 0;
    GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)] = {
        offset: offset,
        length: length,
        mem: mem,
        access: access
    };
    return mem
}
var _emscripten_glMapBufferRange = _glMapBufferRange;

function _glPauseTransformFeedback() {
    GLctx.pauseTransformFeedback()
}
var _emscripten_glPauseTransformFeedback = _glPauseTransformFeedback;

function _glPixelStorei(pname, param) {
    if (pname == 3317) {
        GL.unpackAlignment = param
    }
    GLctx.pixelStorei(pname, param)
}
var _emscripten_glPixelStorei = _glPixelStorei;

function _glPolygonOffset(x0, x1) {
    GLctx.polygonOffset(x0, x1)
}
var _emscripten_glPolygonOffset = _glPolygonOffset;

function _glProgramBinary(program, binaryFormat, binary, length) {
    GL.recordError(1280)
}
var _emscripten_glProgramBinary = _glProgramBinary;

function _glProgramParameteri(program, pname, value) {
    GL.recordError(1280)
}
var _emscripten_glProgramParameteri = _glProgramParameteri;

function _glQueryCounterEXT(id, target) {
    GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id], target)
}
var _emscripten_glQueryCounterEXT = _glQueryCounterEXT;

function _glReadBuffer(x0) {
    GLctx.readBuffer(x0)
}
var _emscripten_glReadBuffer = _glReadBuffer;

function computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
    function roundedToNextMultipleOf(x, y) {
        return x + y - 1 & -y
    }
    var plainRowSize = width * sizePerPixel;
    var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
    return height * alignedRowSize
}

function colorChannelsInGlTextureFormat(format) {
    var colorChannels = {
        5: 3,
        6: 4,
        8: 2,
        29502: 3,
        29504: 4,
        26917: 2,
        26918: 2,
        29846: 3,
        29847: 4
    };
    return colorChannels[format - 6402] || 1
}

function heapObjectForWebGLType(type) {
    type -= 5120;
    if (type == 0) return HEAP8;
    if (type == 1) return HEAPU8;
    if (type == 2) return HEAP16;
    if (type == 4) return HEAP32;
    if (type == 6) return HEAPF32;
    if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782) return HEAPU32;
    return HEAPU16
}

function heapAccessShiftForWebGLHeap(heap) {
    return 31 - Math.clz32(heap.BYTES_PER_ELEMENT)
}

function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
    var heap = heapObjectForWebGLType(type);
    var shift = heapAccessShiftForWebGLHeap(heap);
    var byteSize = 1 << shift;
    var sizePerPixel = colorChannelsInGlTextureFormat(format) * byteSize;
    var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
    return heap.subarray(pixels >>> shift, pixels + bytes >>> shift)
}

function _glReadPixels(x, y, width, height, format, type, pixels) {
    if (true) {
        if (GLctx.currentPixelPackBufferBinding) {
            GLctx.readPixels(x, y, width, height, format, type, pixels)
        } else {
            var heap = heapObjectForWebGLType(type);
            GLctx.readPixels(x, y, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
        }
        return
    }
    var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
    if (!pixelData) {
        GL.recordError(1280);
        return
    }
    GLctx.readPixels(x, y, width, height, format, type, pixelData)
}
var _emscripten_glReadPixels = _glReadPixels;

function _glReleaseShaderCompiler() {}
var _emscripten_glReleaseShaderCompiler = _glReleaseShaderCompiler;

function _glRenderbufferStorage(x0, x1, x2, x3) {
    GLctx.renderbufferStorage(x0, x1, x2, x3)
}
var _emscripten_glRenderbufferStorage = _glRenderbufferStorage;

function _glRenderbufferStorageMultisample(x0, x1, x2, x3, x4) {
    GLctx.renderbufferStorageMultisample(x0, x1, x2, x3, x4)
}
var _emscripten_glRenderbufferStorageMultisample = _glRenderbufferStorageMultisample;

function _glResumeTransformFeedback() {
    GLctx.resumeTransformFeedback()
}
var _emscripten_glResumeTransformFeedback = _glResumeTransformFeedback;

function _glSampleCoverage(value, invert) {
    GLctx.sampleCoverage(value, !!invert)
}
var _emscripten_glSampleCoverage = _glSampleCoverage;

function _glSamplerParameterf(sampler, pname, param) {
    GLctx.samplerParameterf(GL.samplers[sampler], pname, param)
}
var _emscripten_glSamplerParameterf = _glSamplerParameterf;

function _glSamplerParameterfv(sampler, pname, params) {
    var param = HEAPF32[params >>> 2];
    GLctx.samplerParameterf(GL.samplers[sampler], pname, param)
}
var _emscripten_glSamplerParameterfv = _glSamplerParameterfv;

function _glSamplerParameteri(sampler, pname, param) {
    GLctx.samplerParameteri(GL.samplers[sampler], pname, param)
}
var _emscripten_glSamplerParameteri = _glSamplerParameteri;

function _glSamplerParameteriv(sampler, pname, params) {
    var param = HEAP32[params >>> 2];
    GLctx.samplerParameteri(GL.samplers[sampler], pname, param)
}
var _emscripten_glSamplerParameteriv = _glSamplerParameteriv;

function _glScissor(x0, x1, x2, x3) {
    GLctx.scissor(x0, x1, x2, x3)
}
var _emscripten_glScissor = _glScissor;

function _glShaderBinary(count, shaders, binaryformat, binary, length) {
    GL.recordError(1280)
}
var _emscripten_glShaderBinary = _glShaderBinary;

function _glShaderSource(shader, count, string, length) {
    var source = GL.getSource(shader, count, string, length);
    GLctx.shaderSource(GL.shaders[shader], source)
}
var _emscripten_glShaderSource = _glShaderSource;

function _glStencilFunc(x0, x1, x2) {
    GLctx.stencilFunc(x0, x1, x2)
}
var _emscripten_glStencilFunc = _glStencilFunc;

function _glStencilFuncSeparate(x0, x1, x2, x3) {
    GLctx.stencilFuncSeparate(x0, x1, x2, x3)
}
var _emscripten_glStencilFuncSeparate = _glStencilFuncSeparate;

function _glStencilMask(x0) {
    GLctx.stencilMask(x0)
}
var _emscripten_glStencilMask = _glStencilMask;

function _glStencilMaskSeparate(x0, x1) {
    GLctx.stencilMaskSeparate(x0, x1)
}
var _emscripten_glStencilMaskSeparate = _glStencilMaskSeparate;

function _glStencilOp(x0, x1, x2) {
    GLctx.stencilOp(x0, x1, x2)
}
var _emscripten_glStencilOp = _glStencilOp;

function _glStencilOpSeparate(x0, x1, x2, x3) {
    GLctx.stencilOpSeparate(x0, x1, x2, x3)
}
var _emscripten_glStencilOpSeparate = _glStencilOpSeparate;

function _glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
    if (true) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels)
        } else if (pixels) {
            var heap = heapObjectForWebGLType(type);
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
        } else {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, null)
        }
        return
    }
    GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null)
}
var _emscripten_glTexImage2D = _glTexImage2D;

function _glTexImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixels) {
    if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixels)
    } else if (pixels) {
        var heap = heapObjectForWebGLType(type);
        GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
    } else {
        GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, null)
    }
}
var _emscripten_glTexImage3D = _glTexImage3D;

function _glTexParameterf(x0, x1, x2) {
    GLctx.texParameterf(x0, x1, x2)
}
var _emscripten_glTexParameterf = _glTexParameterf;

function _glTexParameterfv(target, pname, params) {
    var param = HEAPF32[params >>> 2];
    GLctx.texParameterf(target, pname, param)
}
var _emscripten_glTexParameterfv = _glTexParameterfv;

function _glTexParameteri(x0, x1, x2) {
    GLctx.texParameteri(x0, x1, x2)
}
var _emscripten_glTexParameteri = _glTexParameteri;

function _glTexParameteriv(target, pname, params) {
    var param = HEAP32[params >>> 2];
    GLctx.texParameteri(target, pname, param)
}
var _emscripten_glTexParameteriv = _glTexParameteriv;

function _glTexStorage2D(x0, x1, x2, x3, x4) {
    GLctx.texStorage2D(x0, x1, x2, x3, x4)
}
var _emscripten_glTexStorage2D = _glTexStorage2D;

function _glTexStorage3D(x0, x1, x2, x3, x4, x5) {
    GLctx.texStorage3D(x0, x1, x2, x3, x4, x5)
}
var _emscripten_glTexStorage3D = _glTexStorage3D;

function _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    if (true) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels)
        } else if (pixels) {
            var heap = heapObjectForWebGLType(type);
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
        } else {
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, null)
        }
        return
    }
    var pixelData = null;
    if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
    GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData)
}
var _emscripten_glTexSubImage2D = _glTexSubImage2D;

function _glTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels) {
    if (GLctx.currentPixelUnpackBufferBinding) {
        GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels)
    } else if (pixels) {
        var heap = heapObjectForWebGLType(type);
        GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap))
    } else {
        GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, null)
    }
}
var _emscripten_glTexSubImage3D = _glTexSubImage3D;

function _glTransformFeedbackVaryings(program, count, varyings, bufferMode) {
    program = GL.programs[program];
    var vars = [];
    for (var i = 0; i < count; i++) vars.push(UTF8ToString(HEAP32[varyings + i * 4 >>> 2]));
    GLctx.transformFeedbackVaryings(program, vars, bufferMode)
}
var _emscripten_glTransformFeedbackVaryings = _glTransformFeedbackVaryings;

function _glUniform1f(location, v0) {
    GLctx.uniform1f(webglGetUniformLocation(location), v0)
}
var _emscripten_glUniform1f = _glUniform1f;

function _glUniform1fv(location, count, value) {
    count && GLctx.uniform1fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count)
}
var _emscripten_glUniform1fv = _glUniform1fv;

function _glUniform1i(location, v0) {
    GLctx.uniform1i(webglGetUniformLocation(location), v0)
}
var _emscripten_glUniform1i = _glUniform1i;

function _glUniform1iv(location, count, value) {
    count && GLctx.uniform1iv(webglGetUniformLocation(location), HEAP32, value >> 2, count)
}
var _emscripten_glUniform1iv = _glUniform1iv;

function _glUniform1ui(location, v0) {
    GLctx.uniform1ui(webglGetUniformLocation(location), v0)
}
var _emscripten_glUniform1ui = _glUniform1ui;

function _glUniform1uiv(location, count, value) {
    count && GLctx.uniform1uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count)
}
var _emscripten_glUniform1uiv = _glUniform1uiv;

function _glUniform2f(location, v0, v1) {
    GLctx.uniform2f(webglGetUniformLocation(location), v0, v1)
}
var _emscripten_glUniform2f = _glUniform2f;

function _glUniform2fv(location, count, value) {
    count && GLctx.uniform2fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 2)
}
var _emscripten_glUniform2fv = _glUniform2fv;

function _glUniform2i(location, v0, v1) {
    GLctx.uniform2i(webglGetUniformLocation(location), v0, v1)
}
var _emscripten_glUniform2i = _glUniform2i;

function _glUniform2iv(location, count, value) {
    count && GLctx.uniform2iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 2)
}
var _emscripten_glUniform2iv = _glUniform2iv;

function _glUniform2ui(location, v0, v1) {
    GLctx.uniform2ui(webglGetUniformLocation(location), v0, v1)
}
var _emscripten_glUniform2ui = _glUniform2ui;

function _glUniform2uiv(location, count, value) {
    count && GLctx.uniform2uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count * 2)
}
var _emscripten_glUniform2uiv = _glUniform2uiv;

function _glUniform3f(location, v0, v1, v2) {
    GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2)
}
var _emscripten_glUniform3f = _glUniform3f;

function _glUniform3fv(location, count, value) {
    count && GLctx.uniform3fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 3)
}
var _emscripten_glUniform3fv = _glUniform3fv;

function _glUniform3i(location, v0, v1, v2) {
    GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2)
}
var _emscripten_glUniform3i = _glUniform3i;

function _glUniform3iv(location, count, value) {
    count && GLctx.uniform3iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 3)
}
var _emscripten_glUniform3iv = _glUniform3iv;

function _glUniform3ui(location, v0, v1, v2) {
    GLctx.uniform3ui(webglGetUniformLocation(location), v0, v1, v2)
}
var _emscripten_glUniform3ui = _glUniform3ui;

function _glUniform3uiv(location, count, value) {
    count && GLctx.uniform3uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count * 3)
}
var _emscripten_glUniform3uiv = _glUniform3uiv;

function _glUniform4f(location, v0, v1, v2, v3) {
    GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3)
}
var _emscripten_glUniform4f = _glUniform4f;

function _glUniform4fv(location, count, value) {
    count && GLctx.uniform4fv(webglGetUniformLocation(location), HEAPF32, value >> 2, count * 4)
}
var _emscripten_glUniform4fv = _glUniform4fv;

function _glUniform4i(location, v0, v1, v2, v3) {
    GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3)
}
var _emscripten_glUniform4i = _glUniform4i;

function _glUniform4iv(location, count, value) {
    count && GLctx.uniform4iv(webglGetUniformLocation(location), HEAP32, value >> 2, count * 4)
}
var _emscripten_glUniform4iv = _glUniform4iv;

function _glUniform4ui(location, v0, v1, v2, v3) {
    GLctx.uniform4ui(webglGetUniformLocation(location), v0, v1, v2, v3)
}
var _emscripten_glUniform4ui = _glUniform4ui;

function _glUniform4uiv(location, count, value) {
    count && GLctx.uniform4uiv(webglGetUniformLocation(location), HEAPU32, value >> 2, count * 4)
}
var _emscripten_glUniform4uiv = _glUniform4uiv;

function _glUniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding) {
    program = GL.programs[program];
    GLctx.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding)
}
var _emscripten_glUniformBlockBinding = _glUniformBlockBinding;

function _glUniformMatrix2fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 4)
}
var _emscripten_glUniformMatrix2fv = _glUniformMatrix2fv;

function _glUniformMatrix2x3fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix2x3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 6)
}
var _emscripten_glUniformMatrix2x3fv = _glUniformMatrix2x3fv;

function _glUniformMatrix2x4fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix2x4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 8)
}
var _emscripten_glUniformMatrix2x4fv = _glUniformMatrix2x4fv;

function _glUniformMatrix3fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 9)
}
var _emscripten_glUniformMatrix3fv = _glUniformMatrix3fv;

function _glUniformMatrix3x2fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix3x2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 6)
}
var _emscripten_glUniformMatrix3x2fv = _glUniformMatrix3x2fv;

function _glUniformMatrix3x4fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix3x4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 12)
}
var _emscripten_glUniformMatrix3x4fv = _glUniformMatrix3x4fv;

function _glUniformMatrix4fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 16)
}
var _emscripten_glUniformMatrix4fv = _glUniformMatrix4fv;

function _glUniformMatrix4x2fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix4x2fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 8)
}
var _emscripten_glUniformMatrix4x2fv = _glUniformMatrix4x2fv;

function _glUniformMatrix4x3fv(location, count, transpose, value) {
    count && GLctx.uniformMatrix4x3fv(webglGetUniformLocation(location), !!transpose, HEAPF32, value >> 2, count * 12)
}
var _emscripten_glUniformMatrix4x3fv = _glUniformMatrix4x3fv;

function _glUnmapBuffer(target) {
    if (!emscriptenWebGLValidateMapBufferTarget(target)) {
        GL.recordError(1280);
        err("GL_INVALID_ENUM in glUnmapBuffer");
        return 0
    }
    var buffer = emscriptenWebGLGetBufferBinding(target);
    var mapping = GL.mappedBuffers[buffer];
    if (!mapping) {
        GL.recordError(1282);
        err("buffer was never mapped in glUnmapBuffer");
        return 0
    }
    GL.mappedBuffers[buffer] = null;
    if (!(mapping.access & 16))
        if (true) {
            GLctx.bufferSubData(target, mapping.offset, HEAPU8, mapping.mem, mapping.length)
        } else {
            GLctx.bufferSubData(target, mapping.offset, HEAPU8.subarray(mapping.mem >>> 0, mapping.mem + mapping.length >>> 0))
        } _free(mapping.mem);
    return 1
}
var _emscripten_glUnmapBuffer = _glUnmapBuffer;

function _glUseProgram(program) {
    program = GL.programs[program];
    GLctx.useProgram(program);
    GLctx.currentProgram = program
}
var _emscripten_glUseProgram = _glUseProgram;

function _glValidateProgram(program) {
    GLctx.validateProgram(GL.programs[program])
}
var _emscripten_glValidateProgram = _glValidateProgram;

function _glVertexAttrib1f(x0, x1) {
    GLctx.vertexAttrib1f(x0, x1)
}
var _emscripten_glVertexAttrib1f = _glVertexAttrib1f;

function _glVertexAttrib1fv(index, v) {
    GLctx.vertexAttrib1f(index, HEAPF32[v >>> 2])
}
var _emscripten_glVertexAttrib1fv = _glVertexAttrib1fv;

function _glVertexAttrib2f(x0, x1, x2) {
    GLctx.vertexAttrib2f(x0, x1, x2)
}
var _emscripten_glVertexAttrib2f = _glVertexAttrib2f;

function _glVertexAttrib2fv(index, v) {
    GLctx.vertexAttrib2f(index, HEAPF32[v >>> 2], HEAPF32[v + 4 >>> 2])
}
var _emscripten_glVertexAttrib2fv = _glVertexAttrib2fv;

function _glVertexAttrib3f(x0, x1, x2, x3) {
    GLctx.vertexAttrib3f(x0, x1, x2, x3)
}
var _emscripten_glVertexAttrib3f = _glVertexAttrib3f;

function _glVertexAttrib3fv(index, v) {
    GLctx.vertexAttrib3f(index, HEAPF32[v >>> 2], HEAPF32[v + 4 >>> 2], HEAPF32[v + 8 >>> 2])
}
var _emscripten_glVertexAttrib3fv = _glVertexAttrib3fv;

function _glVertexAttrib4f(x0, x1, x2, x3, x4) {
    GLctx.vertexAttrib4f(x0, x1, x2, x3, x4)
}
var _emscripten_glVertexAttrib4f = _glVertexAttrib4f;

function _glVertexAttrib4fv(index, v) {
    GLctx.vertexAttrib4f(index, HEAPF32[v >>> 2], HEAPF32[v + 4 >>> 2], HEAPF32[v + 8 >>> 2], HEAPF32[v + 12 >>> 2])
}
var _emscripten_glVertexAttrib4fv = _glVertexAttrib4fv;

function _glVertexAttribDivisor(index, divisor) {
    GLctx.vertexAttribDivisor(index, divisor)
}
var _emscripten_glVertexAttribDivisor = _glVertexAttribDivisor;
var _glVertexAttribDivisorANGLE = _glVertexAttribDivisor;
var _emscripten_glVertexAttribDivisorANGLE = _glVertexAttribDivisorANGLE;
var _glVertexAttribDivisorARB = _glVertexAttribDivisor;
var _emscripten_glVertexAttribDivisorARB = _glVertexAttribDivisorARB;
var _glVertexAttribDivisorEXT = _glVertexAttribDivisor;
var _emscripten_glVertexAttribDivisorEXT = _glVertexAttribDivisorEXT;
var _glVertexAttribDivisorNV = _glVertexAttribDivisor;
var _emscripten_glVertexAttribDivisorNV = _glVertexAttribDivisorNV;

function _glVertexAttribI4i(x0, x1, x2, x3, x4) {
    GLctx.vertexAttribI4i(x0, x1, x2, x3, x4)
}
var _emscripten_glVertexAttribI4i = _glVertexAttribI4i;

function _glVertexAttribI4iv(index, v) {
    GLctx.vertexAttribI4i(index, HEAP32[v >>> 2], HEAP32[v + 4 >>> 2], HEAP32[v + 8 >>> 2], HEAP32[v + 12 >>> 2])
}
var _emscripten_glVertexAttribI4iv = _glVertexAttribI4iv;

function _glVertexAttribI4ui(x0, x1, x2, x3, x4) {
    GLctx.vertexAttribI4ui(x0, x1, x2, x3, x4)
}
var _emscripten_glVertexAttribI4ui = _glVertexAttribI4ui;

function _glVertexAttribI4uiv(index, v) {
    GLctx.vertexAttribI4ui(index, HEAPU32[v >>> 2], HEAPU32[v + 4 >>> 2], HEAPU32[v + 8 >>> 2], HEAPU32[v + 12 >>> 2])
}
var _emscripten_glVertexAttribI4uiv = _glVertexAttribI4uiv;

function _glVertexAttribIPointer(index, size, type, stride, ptr) {
    var cb = GL.currentContext.clientBuffers[index];
    if (!GLctx.currentArrayBufferBinding) {
        cb.size = size;
        cb.type = type;
        cb.normalized = false;
        cb.stride = stride;
        cb.ptr = ptr;
        cb.clientside = true;
        cb.vertexAttribPointerAdaptor = function(index, size, type, normalized, stride, ptr) {
            this.vertexAttribIPointer(index, size, type, stride, ptr)
        };
        return
    }
    cb.clientside = false;
    GLctx.vertexAttribIPointer(index, size, type, stride, ptr)
}
var _emscripten_glVertexAttribIPointer = _glVertexAttribIPointer;

function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
    var cb = GL.currentContext.clientBuffers[index];
    if (!GLctx.currentArrayBufferBinding) {
        cb.size = size;
        cb.type = type;
        cb.normalized = normalized;
        cb.stride = stride;
        cb.ptr = ptr;
        cb.clientside = true;
        cb.vertexAttribPointerAdaptor = function(index, size, type, normalized, stride, ptr) {
            this.vertexAttribPointer(index, size, type, normalized, stride, ptr)
        };
        return
    }
    cb.clientside = false;
    GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr)
}
var _emscripten_glVertexAttribPointer = _glVertexAttribPointer;

function _glViewport(x0, x1, x2, x3) {
    GLctx.viewport(x0, x1, x2, x3)
}
var _emscripten_glViewport = _glViewport;

function _glWaitSync(sync, flags, timeout_low, timeout_high) {
    var timeout = convertI32PairToI53(timeout_low, timeout_high);
    GLctx.waitSync(GL.syncs[sync], flags, timeout)
}
var _emscripten_glWaitSync = _glWaitSync;

function _emscripten_has_asyncify() {
    return 1
}

function _emscripten_is_main_browser_thread() {
    return !ENVIRONMENT_IS_WORKER
}

function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.copyWithin(dest >>> 0, src >>> 0, src + num >>> 0)
}

function doRequestFullscreen(target, strategy) {
    if (!JSEvents.fullscreenEnabled()) return -1;
    target = findEventTarget(target);
    if (!target) return -4;
    if (!target.requestFullscreen && !target.webkitRequestFullscreen) {
        return -3
    }
    var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
    if (!canPerformRequests) {
        if (strategy.deferUntilInEventHandler) {
            JSEvents.deferCall(JSEvents_requestFullscreen, 1, [target, strategy]);
            return 1
        }
        return -2
    }
    return JSEvents_requestFullscreen(target, strategy)
}

function _emscripten_request_fullscreen_strategy(target, deferUntilInEventHandler, fullscreenStrategy) {
    var strategy = {
        scaleMode: HEAP32[fullscreenStrategy >>> 2],
        canvasResolutionScaleMode: HEAP32[fullscreenStrategy + 4 >>> 2],
        filteringMode: HEAP32[fullscreenStrategy + 8 >>> 2],
        deferUntilInEventHandler: deferUntilInEventHandler,
        canvasResizedCallback: HEAP32[fullscreenStrategy + 12 >>> 2],
        canvasResizedCallbackUserData: HEAP32[fullscreenStrategy + 16 >>> 2]
    };
    return doRequestFullscreen(target, strategy)
}

function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
    target = findEventTarget(target);
    if (!target) return -4;
    if (!target.requestPointerLock) {
        return -1
    }
    var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
    if (!canPerformRequests) {
        if (deferUntilInEventHandler) {
            JSEvents.deferCall(requestPointerLock, 2, [target]);
            return 1
        }
        return -2
    }
    return requestPointerLock(target)
}

function getHeapMax() {
    return 4294901760
}

function emscripten_realloc_buffer(size) {
    var b = wasmMemory.buffer;
    try {
        wasmMemory.grow(size - b.byteLength + 65535 >>> 16);
        updateMemoryViews();
        return 1
    } catch (e) {
        err(`emscripten_realloc_buffer: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`)
    }
}

function _emscripten_resize_heap(requestedSize) {
    var oldSize = HEAPU8.length;
    requestedSize = requestedSize >>> 0;
    assert(requestedSize > oldSize);
    var maxHeapSize = getHeapMax();
    if (requestedSize > maxHeapSize) {
        err(`Cannot enlarge memory, asked to go up to ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
        return false
    }
    var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
    for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
            return true
        }
    }
    err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
    return false
}

function _emscripten_sample_gamepad_data() {
    return (JSEvents.lastGamepadState = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : null) ? 0 : -1
}

function registerBeforeUnloadEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
    var beforeUnloadEventHandlerFunc = function(e = event) {
        var confirmationMessage = ((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, 0, userData);
        if (confirmationMessage) {
            confirmationMessage = UTF8ToString(confirmationMessage)
        }
        if (confirmationMessage) {
            e.preventDefault();
            e.returnValue = confirmationMessage;
            return confirmationMessage
        }
    };
    var eventHandler = {
        target: findEventTarget(target),
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: beforeUnloadEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_beforeunload_callback_on_thread(userData, callbackfunc, targetThread) {
    if (typeof onbeforeunload == "undefined") return -1;
    if (targetThread !== 1) return -5;
    registerBeforeUnloadEventCallback(2, userData, true, callbackfunc, 28, "beforeunload");
    return 0
}

function registerFocusEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.focusEvent) JSEvents.focusEvent = _malloc(256);
    var focusEventHandlerFunc = function(e = event) {
        var nodeName = JSEvents.getNodeNameForTarget(e.target);
        var id = e.target.id ? e.target.id : "";
        var focusEvent = JSEvents.focusEvent;
        stringToUTF8(nodeName, focusEvent + 0, 128);
        stringToUTF8(id, focusEvent + 128, 128);
        if (((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, focusEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: findEventTarget(target),
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: focusEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_blur_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerFocusEventCallback(target, userData, useCapture, callbackfunc, 12, "blur", targetThread);
    return 0
}

function _emscripten_set_element_css_size(target, width, height) {
    target = findEventTarget(target);
    if (!target) return -4;
    target.style.width = width + "px";
    target.style.height = height + "px";
    return 0
}

function _emscripten_set_focus_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus", targetThread);
    return 0
}

function fillFullscreenChangeEventData(eventStruct) {
    var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    var isFullscreen = !!fullscreenElement;
    HEAP32[eventStruct >>> 2] = isFullscreen;
    HEAP32[eventStruct + 4 >>> 2] = JSEvents.fullscreenEnabled();
    var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
    var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
    var id = reportedElement && reportedElement.id ? reportedElement.id : "";
    stringToUTF8(nodeName, eventStruct + 8, 128);
    stringToUTF8(id, eventStruct + 136, 128);
    HEAP32[eventStruct + 264 >>> 2] = reportedElement ? reportedElement.clientWidth : 0;
    HEAP32[eventStruct + 268 >>> 2] = reportedElement ? reportedElement.clientHeight : 0;
    HEAP32[eventStruct + 272 >>> 2] = screen.width;
    HEAP32[eventStruct + 276 >>> 2] = screen.height;
    if (isFullscreen) {
        JSEvents.previousFullscreenElement = fullscreenElement
    }
}

function registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.fullscreenChangeEvent) JSEvents.fullscreenChangeEvent = _malloc(280);
    var fullscreenChangeEventhandlerFunc = function(e = event) {
        var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;
        fillFullscreenChangeEventData(fullscreenChangeEvent);
        if (((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, fullscreenChangeEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: fullscreenChangeEventhandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_fullscreenchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    if (!JSEvents.fullscreenEnabled()) return -1;
    target = findEventTarget(target);
    if (!target) return -4;
    registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange", targetThread);
    registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "webkitfullscreenchange", targetThread);
    return 0
}

function registerGamepadEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.gamepadEvent) JSEvents.gamepadEvent = _malloc(1432);
    var gamepadEventHandlerFunc = function(e = event) {
        var gamepadEvent = JSEvents.gamepadEvent;
        fillGamepadEventData(gamepadEvent, e["gamepad"]);
        if (((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, gamepadEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: findEventTarget(target),
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: gamepadEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_gamepadconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
    if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
    registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 26, "gamepadconnected", targetThread);
    return 0
}

function _emscripten_set_gamepaddisconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
    if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
    registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 27, "gamepaddisconnected", targetThread);
    return 0
}

function registerKeyEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc(176);
    var keyEventHandlerFunc = function(e) {
        assert(e);
        var keyEventData = JSEvents.keyEvent;
        HEAPF64[keyEventData >>> 3] = e.timeStamp;
        var idx = keyEventData >> 2;
        HEAP32[idx + 2 >>> 0] = e.location;
        HEAP32[idx + 3 >>> 0] = e.ctrlKey;
        HEAP32[idx + 4 >>> 0] = e.shiftKey;
        HEAP32[idx + 5 >>> 0] = e.altKey;
        HEAP32[idx + 6 >>> 0] = e.metaKey;
        HEAP32[idx + 7 >>> 0] = e.repeat;
        HEAP32[idx + 8 >>> 0] = e.charCode;
        HEAP32[idx + 9 >>> 0] = e.keyCode;
        HEAP32[idx + 10 >>> 0] = e.which;
        stringToUTF8(e.key || "", keyEventData + 44, 32);
        stringToUTF8(e.code || "", keyEventData + 76, 32);
        stringToUTF8(e.char || "", keyEventData + 108, 32);
        stringToUTF8(e.locale || "", keyEventData + 140, 32);
        if (((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, keyEventData, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: findEventTarget(target),
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: keyEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_keydown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);
    return 0
}

function _emscripten_set_keypress_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);
    return 0
}

function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);
    return 0
}

function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop) {
    var browserIterationFunc = () => dynCall_v.call(null, func);
    setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop)
}

function fillMouseEventData(eventStruct, e, target) {
    assert(eventStruct % 4 == 0);
    HEAPF64[eventStruct >>> 3] = e.timeStamp;
    var idx = eventStruct >> 2;
    HEAP32[idx + 2 >>> 0] = e.screenX;
    HEAP32[idx + 3 >>> 0] = e.screenY;
    HEAP32[idx + 4 >>> 0] = e.clientX;
    HEAP32[idx + 5 >>> 0] = e.clientY;
    HEAP32[idx + 6 >>> 0] = e.ctrlKey;
    HEAP32[idx + 7 >>> 0] = e.shiftKey;
    HEAP32[idx + 8 >>> 0] = e.altKey;
    HEAP32[idx + 9 >>> 0] = e.metaKey;
    HEAP16[idx * 2 + 20 >>> 0] = e.button;
    HEAP16[idx * 2 + 21 >>> 0] = e.buttons;
    HEAP32[idx + 11 >>> 0] = e["movementX"];
    HEAP32[idx + 12 >>> 0] = e["movementY"];
    var rect = getBoundingClientRect(target);
    HEAP32[idx + 13 >>> 0] = e.clientX - rect.left;
    HEAP32[idx + 14 >>> 0] = e.clientY - rect.top
}

function registerMouseEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(72);
    target = findEventTarget(target);
    var mouseEventHandlerFunc = function(e = event) {
        fillMouseEventData(JSEvents.mouseEvent, e, target);
        if (((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        allowsDeferredCalls: eventTypeString != "mousemove" && eventTypeString != "mouseenter" && eventTypeString != "mouseleave",
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: mouseEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_mousedown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);
    return 0
}

function _emscripten_set_mouseenter_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerMouseEventCallback(target, userData, useCapture, callbackfunc, 33, "mouseenter", targetThread);
    return 0
}

function _emscripten_set_mouseleave_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave", targetThread);
    return 0
}

function _emscripten_set_mousemove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);
    return 0
}

function _emscripten_set_mouseup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);
    return 0
}

function fillPointerlockChangeEventData(eventStruct) {
    var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
    var isPointerlocked = !!pointerLockElement;
    HEAP32[eventStruct >>> 2] = isPointerlocked;
    var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
    var id = pointerLockElement && pointerLockElement.id ? pointerLockElement.id : "";
    stringToUTF8(nodeName, eventStruct + 4, 128);
    stringToUTF8(id, eventStruct + 132, 128)
}

function registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.pointerlockChangeEvent) JSEvents.pointerlockChangeEvent = _malloc(260);
    var pointerlockChangeEventHandlerFunc = function(e = event) {
        var pointerlockChangeEvent = JSEvents.pointerlockChangeEvent;
        fillPointerlockChangeEventData(pointerlockChangeEvent);
        if (((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, pointerlockChangeEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: pointerlockChangeEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_pointerlockchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    if (!document || !document.body || !document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock) {
        return -1
    }
    target = findEventTarget(target);
    if (!target) return -4;
    registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "pointerlockchange", targetThread);
    registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mozpointerlockchange", targetThread);
    registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "webkitpointerlockchange", targetThread);
    registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mspointerlockchange", targetThread);
    return 0
}

function registerUiEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.uiEvent) JSEvents.uiEvent = _malloc(36);
    target = findEventTarget(target);
    var uiEventHandlerFunc = function(e = event) {
        if (e.target != target) {
            return
        }
        var b = document.body;
        if (!b) {
            return
        }
        var uiEvent = JSEvents.uiEvent;
        HEAP32[uiEvent >>> 2] = e.detail;
        HEAP32[uiEvent + 4 >>> 2] = b.clientWidth;
        HEAP32[uiEvent + 8 >>> 2] = b.clientHeight;
        HEAP32[uiEvent + 12 >>> 2] = innerWidth;
        HEAP32[uiEvent + 16 >>> 2] = innerHeight;
        HEAP32[uiEvent + 20 >>> 2] = outerWidth;
        HEAP32[uiEvent + 24 >>> 2] = outerHeight;
        HEAP32[uiEvent + 28 >>> 2] = pageXOffset;
        HEAP32[uiEvent + 32 >>> 2] = pageYOffset;
        if (((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, uiEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: uiEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_resize_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize", targetThread);
    return 0
}

function registerTouchEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1696);
    target = findEventTarget(target);
    var touchEventHandlerFunc = function(e) {
        assert(e);
        var t, touches = {},
            et = e.touches;
        for (var i = 0; i < et.length; ++i) {
            t = et[i];
            t.isChanged = t.onTarget = 0;
            touches[t.identifier] = t
        }
        for (var i = 0; i < e.changedTouches.length; ++i) {
            t = e.changedTouches[i];
            t.isChanged = 1;
            touches[t.identifier] = t
        }
        for (var i = 0; i < e.targetTouches.length; ++i) {
            touches[e.targetTouches[i].identifier].onTarget = 1
        }
        var touchEvent = JSEvents.touchEvent;
        HEAPF64[touchEvent >>> 3] = e.timeStamp;
        var idx = touchEvent >> 2;
        HEAP32[idx + 3 >>> 0] = e.ctrlKey;
        HEAP32[idx + 4 >>> 0] = e.shiftKey;
        HEAP32[idx + 5 >>> 0] = e.altKey;
        HEAP32[idx + 6 >>> 0] = e.metaKey;
        idx += 7;
        var targetRect = getBoundingClientRect(target);
        var numTouches = 0;
        for (var i in touches) {
            t = touches[i];
            HEAP32[idx + 0 >>> 0] = t.identifier;
            HEAP32[idx + 1 >>> 0] = t.screenX;
            HEAP32[idx + 2 >>> 0] = t.screenY;
            HEAP32[idx + 3 >>> 0] = t.clientX;
            HEAP32[idx + 4 >>> 0] = t.clientY;
            HEAP32[idx + 5 >>> 0] = t.pageX;
            HEAP32[idx + 6 >>> 0] = t.pageY;
            HEAP32[idx + 7 >>> 0] = t.isChanged;
            HEAP32[idx + 8 >>> 0] = t.onTarget;
            HEAP32[idx + 9 >>> 0] = t.clientX - targetRect.left;
            HEAP32[idx + 10 >>> 0] = t.clientY - targetRect.top;
            idx += 13;
            if (++numTouches > 31) {
                break
            }
        }
        HEAP32[touchEvent + 8 >>> 2] = numTouches;
        if (((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, touchEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        allowsDeferredCalls: eventTypeString == "touchstart" || eventTypeString == "touchend",
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: touchEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_touchcancel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel", targetThread);
    return 0
}

function _emscripten_set_touchend_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend", targetThread);
    return 0
}

function _emscripten_set_touchmove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove", targetThread);
    return 0
}

function _emscripten_set_touchstart_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart", targetThread);
    return 0
}

function fillVisibilityChangeEventData(eventStruct) {
    var visibilityStates = ["hidden", "visible", "prerender", "unloaded"];
    var visibilityState = visibilityStates.indexOf(document.visibilityState);
    HEAP32[eventStruct >>> 2] = document.hidden;
    HEAP32[eventStruct + 4 >>> 2] = visibilityState
}

function registerVisibilityChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.visibilityChangeEvent) JSEvents.visibilityChangeEvent = _malloc(8);
    var visibilityChangeEventHandlerFunc = function(e = event) {
        var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
        fillVisibilityChangeEventData(visibilityChangeEvent);
        if (((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, visibilityChangeEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: visibilityChangeEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_visibilitychange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
    if (!specialHTMLTargets[1]) {
        return -4
    }
    registerVisibilityChangeEventCallback(specialHTMLTargets[1], userData, useCapture, callbackfunc, 21, "visibilitychange", targetThread);
    return 0
}

function registerWheelEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc(104);
    var wheelHandlerFunc = function(e = event) {
        var wheelEvent = JSEvents.wheelEvent;
        fillMouseEventData(wheelEvent, e, target);
        HEAPF64[wheelEvent + 72 >>> 3] = e["deltaX"];
        HEAPF64[wheelEvent + 80 >>> 3] = e["deltaY"];
        HEAPF64[wheelEvent + 88 >>> 3] = e["deltaZ"];
        HEAP32[wheelEvent + 96 >>> 2] = e["deltaMode"];
        if (((a1, a2, a3) => dynCall_iiii.apply(null, [callbackfunc, a1, a2, a3]))(eventTypeId, wheelEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: wheelHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_wheel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    target = findEventTarget(target);
    if (typeof target.onwheel != "undefined") {
        registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
        return 0
    } else {
        return -1
    }
}

function _emscripten_set_window_title(title) {
    setWindowTitle(UTF8ToString(title))
}

function _emscripten_sleep(ms) {
    return Asyncify.handleSleep(wakeUp => safeSetTimeout(wakeUp, ms))
}
_emscripten_sleep.isAsync = true;
var Fetch = {
    xhrs: {},
    openDatabase: function(dbname, dbversion, onsuccess, onerror) {
        try {
            var openRequest = indexedDB.open(dbname, dbversion)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = event => {
            var db = event.target.result;
            if (db.objectStoreNames.contains("FILES")) {
                db.deleteObjectStore("FILES")
            }
            db.createObjectStore("FILES")
        };
        openRequest.onsuccess = event => onsuccess(event.target.result);
        openRequest.onerror = error => onerror(error)
    },
    staticInit: function() {
        var onsuccess = db => {
            Fetch.dbInstance = db;
            removeRunDependency("library_fetch_init")
        };
        var onerror = () => {
            Fetch.dbInstance = false;
            removeRunDependency("library_fetch_init")
        };
        addRunDependency("library_fetch_init");
        Fetch.openDatabase("emscripten_filesystem", 1, onsuccess, onerror)
    }
};

function fetchXHR(fetch, onsuccess, onerror, onprogress, onreadystatechange) {
    var url = HEAPU32[fetch + 8 >>> 2];
    if (!url) {
        onerror(fetch, 0, "no url specified!");
        return
    }
    var url_ = UTF8ToString(url);
    var fetch_attr = fetch + 112;
    var requestMethod = UTF8ToString(fetch_attr);
    if (!requestMethod) requestMethod = "GET";
    var userData = HEAPU32[fetch_attr + 4 >>> 2];
    var fetchAttributes = HEAPU32[fetch_attr + 52 >>> 2];
    var timeoutMsecs = HEAPU32[fetch_attr + 56 >>> 2];
    var withCredentials = !!HEAPU8[fetch_attr + 60 >>> 0];
    var destinationPath = HEAPU32[fetch_attr + 64 >>> 2];
    var userName = HEAPU32[fetch_attr + 68 >>> 2];
    var password = HEAPU32[fetch_attr + 72 >>> 2];
    var requestHeaders = HEAPU32[fetch_attr + 76 >>> 2];
    var overriddenMimeType = HEAPU32[fetch_attr + 80 >>> 2];
    var dataPtr = HEAPU32[fetch_attr + 84 >>> 2];
    var dataLength = HEAPU32[fetch_attr + 88 >>> 2];
    var fetchAttrLoadToMemory = !!(fetchAttributes & 1);
    var fetchAttrStreamData = !!(fetchAttributes & 2);
    var fetchAttrSynchronous = !!(fetchAttributes & 64);
    var userNameStr = userName ? UTF8ToString(userName) : undefined;
    var passwordStr = password ? UTF8ToString(password) : undefined;
    var xhr = new XMLHttpRequest;
    xhr.withCredentials = withCredentials;
    xhr.open(requestMethod, url_, !fetchAttrSynchronous, userNameStr, passwordStr);
    if (!fetchAttrSynchronous) xhr.timeout = timeoutMsecs;
    xhr.url_ = url_;
    assert(!fetchAttrStreamData, "streaming uses moz-chunked-arraybuffer which is no longer supported; TODO: rewrite using fetch()");
    xhr.responseType = "arraybuffer";
    if (overriddenMimeType) {
        var overriddenMimeTypeStr = UTF8ToString(overriddenMimeType);
        xhr.overrideMimeType(overriddenMimeTypeStr)
    }
    if (requestHeaders) {
        for (;;) {
            var key = HEAPU32[requestHeaders >>> 2];
            if (!key) break;
            var value = HEAPU32[requestHeaders + 4 >>> 2];
            if (!value) break;
            requestHeaders += 8;
            var keyStr = UTF8ToString(key);
            var valueStr = UTF8ToString(value);
            xhr.setRequestHeader(keyStr, valueStr)
        }
    }
    var id = HEAPU32[fetch >>> 2];
    Fetch.xhrs[id] = xhr;
    var data = dataPtr && dataLength ? HEAPU8.slice(dataPtr, dataPtr + dataLength) : null;

    function saveResponseAndStatus() {
        var ptr = 0;
        var ptrLen = 0;
        if (xhr.response && fetchAttrLoadToMemory && HEAPU32[fetch + 12 >>> 2] === 0) {
            ptrLen = xhr.response.byteLength
        }
        if (ptrLen > 0) {
            ptr = _malloc(ptrLen);
            HEAPU8.set(new Uint8Array(xhr.response), ptr >>> 0)
        }
        HEAPU32[fetch + 12 >>> 2] = ptr;
        writeI53ToI64(fetch + 16, ptrLen);
        writeI53ToI64(fetch + 24, 0);
        var len = xhr.response ? xhr.response.byteLength : 0;
        if (len) {
            writeI53ToI64(fetch + 32, len)
        }
        HEAPU16[fetch + 40 >>> 1] = xhr.readyState;
        HEAPU16[fetch + 42 >>> 1] = xhr.status;
        if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64)
    }
    xhr.onload = e => {
        if (!(id in Fetch.xhrs)) {
            return
        }
        saveResponseAndStatus();
        if (xhr.status >= 200 && xhr.status < 300) {
            if (onsuccess) onsuccess(fetch, xhr, e)
        } else {
            if (onerror) onerror(fetch, xhr, e)
        }
    };
    xhr.onerror = e => {
        if (!(id in Fetch.xhrs)) {
            return
        }
        saveResponseAndStatus();
        if (onerror) onerror(fetch, xhr, e)
    };
    xhr.ontimeout = e => {
        if (!(id in Fetch.xhrs)) {
            return
        }
        if (onerror) onerror(fetch, xhr, e)
    };
    xhr.onprogress = e => {
        if (!(id in Fetch.xhrs)) {
            return
        }
        var ptrLen = fetchAttrLoadToMemory && fetchAttrStreamData && xhr.response ? xhr.response.byteLength : 0;
        var ptr = 0;
        if (ptrLen > 0 && fetchAttrLoadToMemory && fetchAttrStreamData) {
            assert(onprogress, "When doing a streaming fetch, you should have an onprogress handler registered to receive the chunks!");
            ptr = _malloc(ptrLen);
            HEAPU8.set(new Uint8Array(xhr.response), ptr >>> 0)
        }
        HEAPU32[fetch + 12 >>> 2] = ptr;
        writeI53ToI64(fetch + 16, ptrLen);
        writeI53ToI64(fetch + 24, e.loaded - ptrLen);
        writeI53ToI64(fetch + 32, e.total);
        HEAPU16[fetch + 40 >>> 1] = xhr.readyState;
        if (xhr.readyState >= 3 && xhr.status === 0 && e.loaded > 0) xhr.status = 200;
        HEAPU16[fetch + 42 >>> 1] = xhr.status;
        if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
        if (onprogress) onprogress(fetch, xhr, e);
        if (ptr) {
            _free(ptr)
        }
    };
    xhr.onreadystatechange = e => {
        if (!(id in Fetch.xhrs)) {
            return
        }
        HEAPU16[fetch + 40 >>> 1] = xhr.readyState;
        if (xhr.readyState >= 2) {
            HEAPU16[fetch + 42 >>> 1] = xhr.status
        }
        if (onreadystatechange) onreadystatechange(fetch, xhr, e)
    };
    try {
        xhr.send(data)
    } catch (e) {
        if (onerror) onerror(fetch, xhr, e)
    }
}

function fetchCacheData(db, fetch, data, onsuccess, onerror) {
    if (!db) {
        onerror(fetch, 0, "IndexedDB not available!");
        return
    }
    var fetch_attr = fetch + 112;
    var destinationPath = HEAPU32[fetch_attr + 64 >>> 2];
    if (!destinationPath) destinationPath = HEAPU32[fetch + 8 >>> 2];
    var destinationPathStr = UTF8ToString(destinationPath);
    try {
        var transaction = db.transaction(["FILES"], "readwrite");
        var packages = transaction.objectStore("FILES");
        var putRequest = packages.put(data, destinationPathStr);
        putRequest.onsuccess = event => {
            HEAPU16[fetch + 40 >>> 1] = 4;
            HEAPU16[fetch + 42 >>> 1] = 200;
            stringToUTF8("OK", fetch + 44, 64);
            onsuccess(fetch, 0, destinationPathStr)
        };
        putRequest.onerror = error => {
            HEAPU16[fetch + 40 >>> 1] = 4;
            HEAPU16[fetch + 42 >>> 1] = 413;
            stringToUTF8("Payload Too Large", fetch + 44, 64);
            onerror(fetch, 0, error)
        }
    } catch (e) {
        onerror(fetch, 0, e)
    }
}

function fetchLoadCachedData(db, fetch, onsuccess, onerror) {
    if (!db) {
        onerror(fetch, 0, "IndexedDB not available!");
        return
    }
    var fetch_attr = fetch + 112;
    var path = HEAPU32[fetch_attr + 64 >>> 2];
    if (!path) path = HEAPU32[fetch + 8 >>> 2];
    var pathStr = UTF8ToString(path);
    try {
        var transaction = db.transaction(["FILES"], "readonly");
        var packages = transaction.objectStore("FILES");
        var getRequest = packages.get(pathStr);
        getRequest.onsuccess = event => {
            if (event.target.result) {
                var value = event.target.result;
                var len = value.byteLength || value.length;
                var ptr = _malloc(len);
                HEAPU8.set(new Uint8Array(value), ptr >>> 0);
                HEAPU32[fetch + 12 >>> 2] = ptr;
                writeI53ToI64(fetch + 16, len);
                writeI53ToI64(fetch + 24, 0);
                writeI53ToI64(fetch + 32, len);
                HEAPU16[fetch + 40 >>> 1] = 4;
                HEAPU16[fetch + 42 >>> 1] = 200;
                stringToUTF8("OK", fetch + 44, 64);
                onsuccess(fetch, 0, value)
            } else {
                HEAPU16[fetch + 40 >>> 1] = 4;
                HEAPU16[fetch + 42 >>> 1] = 404;
                stringToUTF8("Not Found", fetch + 44, 64);
                onerror(fetch, 0, "no data")
            }
        };
        getRequest.onerror = error => {
            HEAPU16[fetch + 40 >>> 1] = 4;
            HEAPU16[fetch + 42 >>> 1] = 404;
            stringToUTF8("Not Found", fetch + 44, 64);
            onerror(fetch, 0, error)
        }
    } catch (e) {
        onerror(fetch, 0, e)
    }
}

function fetchDeleteCachedData(db, fetch, onsuccess, onerror) {
    if (!db) {
        onerror(fetch, 0, "IndexedDB not available!");
        return
    }
    var fetch_attr = fetch + 112;
    var path = HEAPU32[fetch_attr + 64 >>> 2];
    if (!path) path = HEAPU32[fetch + 8 >>> 2];
    var pathStr = UTF8ToString(path);
    try {
        var transaction = db.transaction(["FILES"], "readwrite");
        var packages = transaction.objectStore("FILES");
        var request = packages.delete(pathStr);
        request.onsuccess = event => {
            var value = event.target.result;
            HEAPU32[fetch + 12 >>> 2] = 0;
            writeI53ToI64(fetch + 16, 0);
            writeI53ToI64(fetch + 24, 0);
            writeI53ToI64(fetch + 32, 0);
            HEAPU16[fetch + 40 >>> 1] = 4;
            HEAPU16[fetch + 42 >>> 1] = 200;
            stringToUTF8("OK", fetch + 44, 64);
            onsuccess(fetch, 0, value)
        };
        request.onerror = error => {
            HEAPU16[fetch + 40 >>> 1] = 4;
            HEAPU16[fetch + 42 >>> 1] = 404;
            stringToUTF8("Not Found", fetch + 44, 64);
            onerror(fetch, 0, error)
        }
    } catch (e) {
        onerror(fetch, 0, e)
    }
}

function _emscripten_start_fetch(fetch, successcb, errorcb, progresscb, readystatechangecb) {
    var fetch_attr = fetch + 112;
    var requestMethod = UTF8ToString(fetch_attr);
    var onsuccess = HEAPU32[fetch_attr + 36 >>> 2];
    var onerror = HEAPU32[fetch_attr + 40 >>> 2];
    var onprogress = HEAPU32[fetch_attr + 44 >>> 2];
    var onreadystatechange = HEAPU32[fetch_attr + 48 >>> 2];
    var fetchAttributes = HEAPU32[fetch_attr + 52 >>> 2];
    var fetchAttrPersistFile = !!(fetchAttributes & 4);
    var fetchAttrNoDownload = !!(fetchAttributes & 32);
    var fetchAttrReplace = !!(fetchAttributes & 16);
    var fetchAttrSynchronous = !!(fetchAttributes & 64);

    function doCallback(f) {
        if (fetchAttrSynchronous) {
            f()
        } else {
            callUserCallback(f)
        }
    }
    var reportSuccess = (fetch, xhr, e) => {
        doCallback(() => {
            if (onsuccess)(a1 => dynCall_vi.apply(null, [onsuccess, a1]))(fetch);
            else if (successcb) successcb(fetch)
        })
    };
    var reportProgress = (fetch, xhr, e) => {
        doCallback(() => {
            if (onprogress)(a1 => dynCall_vi.apply(null, [onprogress, a1]))(fetch);
            else if (progresscb) progresscb(fetch)
        })
    };
    var reportError = (fetch, xhr, e) => {
        doCallback(() => {
            if (onerror)(a1 => dynCall_vi.apply(null, [onerror, a1]))(fetch);
            else if (errorcb) errorcb(fetch)
        })
    };
    var reportReadyStateChange = (fetch, xhr, e) => {
        doCallback(() => {
            if (onreadystatechange)(a1 => dynCall_vi.apply(null, [onreadystatechange, a1]))(fetch);
            else if (readystatechangecb) readystatechangecb(fetch)
        })
    };
    var performUncachedXhr = (fetch, xhr, e) => {
        fetchXHR(fetch, reportSuccess, reportError, reportProgress, reportReadyStateChange)
    };
    var cacheResultAndReportSuccess = (fetch, xhr, e) => {
        var storeSuccess = (fetch, xhr, e) => {
            doCallback(() => {
                if (onsuccess)(a1 => dynCall_vi.apply(null, [onsuccess, a1]))(fetch);
                else if (successcb) successcb(fetch)
            })
        };
        var storeError = (fetch, xhr, e) => {
            doCallback(() => {
                if (onsuccess)(a1 => dynCall_vi.apply(null, [onsuccess, a1]))(fetch);
                else if (successcb) successcb(fetch)
            })
        };
        fetchCacheData(Fetch.dbInstance, fetch, xhr.response, storeSuccess, storeError)
    };
    var performCachedXhr = (fetch, xhr, e) => {
        fetchXHR(fetch, cacheResultAndReportSuccess, reportError, reportProgress, reportReadyStateChange)
    };
    if (requestMethod === "EM_IDB_STORE") {
        var ptr = HEAPU32[fetch_attr + 84 >>> 2];
        fetchCacheData(Fetch.dbInstance, fetch, HEAPU8.slice(ptr, ptr + HEAPU32[fetch_attr + 88 >>> 2]), reportSuccess, reportError)
    } else if (requestMethod === "EM_IDB_DELETE") {
        fetchDeleteCachedData(Fetch.dbInstance, fetch, reportSuccess, reportError)
    } else if (!fetchAttrReplace) {
        fetchLoadCachedData(Fetch.dbInstance, fetch, reportSuccess, fetchAttrNoDownload ? reportError : fetchAttrPersistFile ? performCachedXhr : performUncachedXhr)
    } else if (!fetchAttrNoDownload) {
        fetchXHR(fetch, fetchAttrPersistFile ? cacheResultAndReportSuccess : reportSuccess, reportError, reportProgress, reportReadyStateChange)
    } else {
        return 0
    }
    return fetch
}
var ENV = {};

function getExecutableName() {
    return thisProgram || "./this.program"
}

function getEnvStrings() {
    if (!getEnvStrings.strings) {
        var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
        var env = {
            "USER": "web_user",
            "LOGNAME": "web_user",
            "PATH": "/",
            "PWD": "/",
            "HOME": "/home/web_user",
            "LANG": lang,
            "_": getExecutableName()
        };
        for (var x in ENV) {
            if (ENV[x] === undefined) delete env[x];
            else env[x] = ENV[x]
        }
        var strings = [];
        for (var x in env) {
            strings.push(x + "=" + env[x])
        }
        getEnvStrings.strings = strings
    }
    return getEnvStrings.strings
}

function stringToAscii(str, buffer) {
    for (var i = 0; i < str.length; ++i) {
        assert(str.charCodeAt(i) === (str.charCodeAt(i) & 255));
        HEAP8[buffer++ >>> 0] = str.charCodeAt(i)
    }
    HEAP8[buffer >>> 0] = 0
}

function _environ_get(__environ, environ_buf) {
    var bufSize = 0;
    getEnvStrings().forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAPU32[__environ + i * 4 >>> 2] = ptr;
        stringToAscii(string, ptr);
        bufSize += string.length + 1
    });
    return 0
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
    var strings = getEnvStrings();
    HEAPU32[penviron_count >>> 2] = strings.length;
    var bufSize = 0;
    strings.forEach(function(string) {
        bufSize += string.length + 1
    });
    HEAPU32[penviron_buf_size >>> 2] = bufSize;
    return 0
}

function _fd_close(fd) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.close(stream);
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno
    }
}

function doReadv(stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >>> 2];
        var len = HEAPU32[iov + 4 >>> 2];
        iov += 8;
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break;
        if (typeof offset !== "undefined") {
            offset += curr
        }
    }
    return ret
}

function _fd_read(fd, iov, iovcnt, pnum) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doReadv(stream, iov, iovcnt);
        HEAPU32[pnum >>> 2] = num;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno
    }
}

function convertI32PairToI53Checked(lo, hi) {
    assert(lo == lo >>> 0 || lo == (lo | 0));
    assert(hi === (hi | 0));
    return hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN
}

function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
    try {
        var offset = convertI32PairToI53Checked(offset_low, offset_high);
        if (isNaN(offset)) return 61;
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.llseek(stream, offset, whence);
        tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >>> 2] = tempI64[0], HEAP32[newOffset + 4 >>> 2] = tempI64[1];
        if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno
    }
}

function doWritev(stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >>> 2];
        var len = HEAPU32[iov + 4 >>> 2];
        iov += 8;
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (typeof offset !== "undefined") {
            offset += curr
        }
    }
    return ret
}

function _fd_write(fd, iov, iovcnt, pnum) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = doWritev(stream, iov, iovcnt);
        HEAPU32[pnum >>> 2] = num;
        return 0
    } catch (e) {
        if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
        return e.errno
    }
}

function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

function arraySum(array, index) {
    var sum = 0;
    for (var i = 0; i <= index; sum += array[i++]) {}
    return sum
}
var MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function addDays(date, days) {
    var newDate = new Date(date.getTime());
    while (days > 0) {
        var leap = isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
            days -= daysInCurrentMonth - newDate.getDate() + 1;
            newDate.setDate(1);
            if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1)
            } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1)
            }
        } else {
            newDate.setDate(newDate.getDate() + days);
            return newDate
        }
    }
    return newDate
}

function writeArrayToMemory(array, buffer) {
    assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
    HEAP8.set(array, buffer >>> 0)
}

function _strftime(s, maxsize, format, tm) {
    var tm_zone = HEAP32[tm + 40 >>> 2];
    var date = {
        tm_sec: HEAP32[tm >>> 2],
        tm_min: HEAP32[tm + 4 >>> 2],
        tm_hour: HEAP32[tm + 8 >>> 2],
        tm_mday: HEAP32[tm + 12 >>> 2],
        tm_mon: HEAP32[tm + 16 >>> 2],
        tm_year: HEAP32[tm + 20 >>> 2],
        tm_wday: HEAP32[tm + 24 >>> 2],
        tm_yday: HEAP32[tm + 28 >>> 2],
        tm_isdst: HEAP32[tm + 32 >>> 2],
        tm_gmtoff: HEAP32[tm + 36 >>> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
    };
    var pattern = UTF8ToString(format);
    var EXPANSION_RULES_1 = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
    };
    for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule])
    }
    var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function leadingSomething(value, digits, character) {
        var str = typeof value == "number" ? value.toString() : value || "";
        while (str.length < digits) {
            str = character[0] + str
        }
        return str
    }

    function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0")
    }

    function compareByDay(date1, date2) {
        function sgn(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate())
            }
        }
        return compare
    }

    function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
            case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
            case 1:
                return janFourth;
            case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
            case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
            case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
            case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
            case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30)
        }
    }

    function getWeekBasedYear(date) {
        var thisDate = addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
        var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1
            }
            return thisDate.getFullYear()
        }
        return thisDate.getFullYear() - 1
    }
    var EXPANSION_RULES_2 = {
        "%a": function(date) {
            return WEEKDAYS[date.tm_wday].substring(0, 3)
        },
        "%A": function(date) {
            return WEEKDAYS[date.tm_wday]
        },
        "%b": function(date) {
            return MONTHS[date.tm_mon].substring(0, 3)
        },
        "%B": function(date) {
            return MONTHS[date.tm_mon]
        },
        "%C": function(date) {
            var year = date.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2)
        },
        "%d": function(date) {
            return leadingNulls(date.tm_mday, 2)
        },
        "%e": function(date) {
            return leadingSomething(date.tm_mday, 2, " ")
        },
        "%g": function(date) {
            return getWeekBasedYear(date).toString().substring(2)
        },
        "%G": function(date) {
            return getWeekBasedYear(date)
        },
        "%H": function(date) {
            return leadingNulls(date.tm_hour, 2)
        },
        "%I": function(date) {
            var twelveHour = date.tm_hour;
            if (twelveHour == 0) twelveHour = 12;
            else if (twelveHour > 12) twelveHour -= 12;
            return leadingNulls(twelveHour, 2)
        },
        "%j": function(date) {
            return leadingNulls(date.tm_mday + arraySum(isLeapYear(date.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date.tm_mon - 1), 3)
        },
        "%m": function(date) {
            return leadingNulls(date.tm_mon + 1, 2)
        },
        "%M": function(date) {
            return leadingNulls(date.tm_min, 2)
        },
        "%n": function() {
            return "\n"
        },
        "%p": function(date) {
            if (date.tm_hour >= 0 && date.tm_hour < 12) {
                return "AM"
            }
            return "PM"
        },
        "%S": function(date) {
            return leadingNulls(date.tm_sec, 2)
        },
        "%t": function() {
            return "\t"
        },
        "%u": function(date) {
            return date.tm_wday || 7
        },
        "%U": function(date) {
            var days = date.tm_yday + 7 - date.tm_wday;
            return leadingNulls(Math.floor(days / 7), 2)
        },
        "%V": function(date) {
            var val = Math.floor((date.tm_yday + 7 - (date.tm_wday + 6) % 7) / 7);
            if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
                val++
            }
            if (!val) {
                val = 52;
                var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
                if (dec31 == 4 || dec31 == 5 && isLeapYear(date.tm_year % 400 - 1)) {
                    val++
                }
            } else if (val == 53) {
                var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
                if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date.tm_year))) val = 1
            }
            return leadingNulls(val, 2)
        },
        "%w": function(date) {
            return date.tm_wday
        },
        "%W": function(date) {
            var days = date.tm_yday + 7 - (date.tm_wday + 6) % 7;
            return leadingNulls(Math.floor(days / 7), 2)
        },
        "%y": function(date) {
            return (date.tm_year + 1900).toString().substring(2)
        },
        "%Y": function(date) {
            return date.tm_year + 1900
        },
        "%z": function(date) {
            var off = date.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
        },
        "%Z": function(date) {
            return date.tm_zone
        },
        "%%": function() {
            return "%"
        }
    };
    pattern = pattern.replace(/%%/g, "\0\0");
    for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date))
        }
    }
    pattern = pattern.replace(/\0\0/g, "%");
    var bytes = intArrayFromString(pattern, false);
    if (bytes.length > maxsize) {
        return 0
    }
    writeArrayToMemory(bytes, s);
    return bytes.length - 1
}

function _strftime_l(s, maxsize, format, tm, loc) {
    return _strftime(s, maxsize, format, tm)
}

function runAndAbortIfError(func) {
    try {
        return func()
    } catch (e) {
        abort(e)
    }
}

function runtimeKeepalivePush() {
    runtimeKeepaliveCounter += 1
}

function runtimeKeepalivePop() {
    assert(runtimeKeepaliveCounter > 0);
    runtimeKeepaliveCounter -= 1
}
var Asyncify = {
    instrumentWasmImports: function(imports) {
        var importPatterns = [/^invoke_.*$/, /^fd_sync$/, /^__wasi_fd_sync$/, /^__asyncjs__.*$/, /^emscripten_idb_load$/, /^emscripten_idb_store$/, /^emscripten_idb_delete$/, /^emscripten_idb_exists$/, /^emscripten_idb_load_blob$/, /^emscripten_idb_store_blob$/, /^emscripten_sleep$/, /^emscripten_wget$/, /^emscripten_wget_data$/, /^emscripten_scan_registers$/, /^emscripten_lazy_load_code$/, /^_load_secondary_module$/, /^emscripten_fiber_swap$/];
        for (var x in imports) {
            (function(x) {
                var original = imports[x];
                var sig = original.sig;
                if (typeof original == "function") {
                    var isAsyncifyImport = original.isAsync || importPatterns.some(pattern => !!x.match(pattern));
                    imports[x] = function() {
                        var originalAsyncifyState = Asyncify.state;
                        try {
                            return original.apply(null, arguments)
                        } finally {
                            var changedToDisabled = originalAsyncifyState === Asyncify.State.Normal && Asyncify.state === Asyncify.State.Disabled;
                            var ignoredInvoke = x.startsWith("invoke_") && true;
                            if (Asyncify.state !== originalAsyncifyState && !isAsyncifyImport && !changedToDisabled && !ignoredInvoke) {
                                throw new Error("import " + x + " was not in ASYNCIFY_IMPORTS, but changed the state")
                            }
                        }
                    }
                }
            })(x)
        }
    },
    instrumentWasmExports: function(exports) {
        var ret = {};
        for (var x in exports) {
            (function(x) {
                var original = exports[x];
                if (typeof original == "function") {
                    ret[x] = function() {
                        Asyncify.exportCallStack.push(x);
                        try {
                            return original.apply(null, arguments)
                        } finally {
                            if (!ABORT) {
                                var y = Asyncify.exportCallStack.pop();
                                assert(y === x);
                                Asyncify.maybeStopUnwind()
                            }
                        }
                    }
                } else {
                    ret[x] = original
                }
            })(x)
        }
        return ret
    },
    State: {
        Normal: 0,
        Unwinding: 1,
        Rewinding: 2,
        Disabled: 3
    },
    state: 0,
    StackSize: 4096,
    currData: null,
    handleSleepReturnValue: 0,
    exportCallStack: [],
    callStackNameToId: {},
    callStackIdToName: {},
    callStackId: 0,
    asyncPromiseHandlers: null,
    sleepCallbacks: [],
    getCallStackId: function(funcName) {
        var id = Asyncify.callStackNameToId[funcName];
        if (id === undefined) {
            id = Asyncify.callStackId++;
            Asyncify.callStackNameToId[funcName] = id;
            Asyncify.callStackIdToName[id] = funcName
        }
        return id
    },
    maybeStopUnwind: function() {
        if (Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && Asyncify.exportCallStack.length === 0) {
            Asyncify.state = Asyncify.State.Normal;
            runAndAbortIfError(_asyncify_stop_unwind);
            if (typeof Fibers != "undefined") {
                Fibers.trampoline()
            }
        }
    },
    whenDone: function() {
        assert(Asyncify.currData, "Tried to wait for an async operation when none is in progress.");
        assert(!Asyncify.asyncPromiseHandlers, "Cannot have multiple async operations in flight at once");
        return new Promise((resolve, reject) => {
            Asyncify.asyncPromiseHandlers = {
                resolve: resolve,
                reject: reject
            }
        })
    },
    allocateData: function() {
        var ptr = _malloc(12 + Asyncify.StackSize);
        Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
        Asyncify.setDataRewindFunc(ptr);
        return ptr
    },
    setDataHeader: function(ptr, stack, stackSize) {
        HEAP32[ptr >>> 2] = stack;
        HEAP32[ptr + 4 >>> 2] = stack + stackSize
    },
    setDataRewindFunc: function(ptr) {
        var bottomOfCallStack = Asyncify.exportCallStack[0];
        var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
        HEAP32[ptr + 8 >>> 2] = rewindId
    },
    getDataRewindFunc: function(ptr) {
        var id = HEAP32[ptr + 8 >>> 2];
        var name = Asyncify.callStackIdToName[id];
        var func = Module["asm"][name];
        return func
    },
    doRewind: function(ptr) {
        var start = Asyncify.getDataRewindFunc(ptr);
        return start()
    },
    handleSleep: function(startAsync) {
        assert(Asyncify.state !== Asyncify.State.Disabled, "Asyncify cannot be done during or after the runtime exits");
        if (ABORT) return;
        if (Asyncify.state === Asyncify.State.Normal) {
            var reachedCallback = false;
            var reachedAfterCallback = false;
            startAsync((handleSleepReturnValue = 0) => {
                assert(!handleSleepReturnValue || typeof handleSleepReturnValue == "number" || typeof handleSleepReturnValue == "boolean");
                if (ABORT) return;
                Asyncify.handleSleepReturnValue = handleSleepReturnValue;
                reachedCallback = true;
                if (!reachedAfterCallback) {
                    return
                }
                assert(!Asyncify.exportCallStack.length, "Waking up (starting to rewind) must be done from JS, without compiled code on the stack.");
                Asyncify.state = Asyncify.State.Rewinding;
                runAndAbortIfError(() => _asyncify_start_rewind(Asyncify.currData));
                if (typeof Browser != "undefined" && Browser.mainLoop.func) {
                    Browser.mainLoop.resume()
                }
                var asyncWasmReturnValue, isError = false;
                try {
                    asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData)
                } catch (err) {
                    asyncWasmReturnValue = err;
                    isError = true
                }
                var handled = false;
                if (!Asyncify.currData) {
                    var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
                    if (asyncPromiseHandlers) {
                        Asyncify.asyncPromiseHandlers = null;
                        (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
                        handled = true
                    }
                }
                if (isError && !handled) {
                    throw asyncWasmReturnValue
                }
            });
            reachedAfterCallback = true;
            if (!reachedCallback) {
                Asyncify.state = Asyncify.State.Unwinding;
                Asyncify.currData = Asyncify.allocateData();
                if (typeof Browser != "undefined" && Browser.mainLoop.func) {
                    Browser.mainLoop.pause()
                }
                runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData))
            }
        } else if (Asyncify.state === Asyncify.State.Rewinding) {
            Asyncify.state = Asyncify.State.Normal;
            runAndAbortIfError(_asyncify_stop_rewind);
            _free(Asyncify.currData);
            Asyncify.currData = null;
            Asyncify.sleepCallbacks.forEach(func => callUserCallback(func))
        } else {
            abort("invalid state: " + Asyncify.state)
        }
        return Asyncify.handleSleepReturnValue
    },
    handleAsync: function(startAsync) {
        return Asyncify.handleSleep(wakeUp => {
            startAsync().then(wakeUp)
        })
    }
};

function getCFunc(ident) {
    var func = Module["_" + ident];
    assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
    return func
}

function ccall(ident, returnType, argTypes, args, opts) {
    var toC = {
        "string": str => {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) {
                ret = stringToUTF8OnStack(str)
            }
            return ret
        },
        "array": arr => {
            var ret = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret
        }
    };

    function convertReturnValue(ret) {
        if (returnType === "string") {
            return UTF8ToString(ret)
        }
        if (returnType === "boolean") return Boolean(ret);
        return ret
    }
    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    assert(returnType !== "array", 'Return type should not be "array".');
    if (args) {
        for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
                if (stack === 0) stack = stackSave();
                cArgs[i] = converter(args[i])
            } else {
                cArgs[i] = args[i]
            }
        }
    }
    var previousAsync = Asyncify.currData;
    var ret = func.apply(null, cArgs);

    function onDone(ret) {
        runtimeKeepalivePop();
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret)
    }
    runtimeKeepalivePush();
    var asyncMode = opts && opts.async;
    if (Asyncify.currData != previousAsync) {
        assert(!(previousAsync && Asyncify.currData), "We cannot start an async operation when one is already flight");
        assert(!(previousAsync && !Asyncify.currData), "We cannot stop an async operation in flight");
        assert(asyncMode, "The call to " + ident + " is running asynchronously. If this was intended, add the async option to the ccall/cwrap call.");
        return Asyncify.whenDone().then(onDone)
    }
    ret = onDone(ret);
    if (asyncMode) return Promise.resolve(ret);
    return ret
}

function cwrap(ident, returnType, argTypes, opts) {
    return function() {
        return ccall(ident, returnType, argTypes, arguments, opts)
    }
}
var ALLOC_NORMAL = 0;
var ALLOC_STACK = 1;

function allocate(slab, allocator) {
    var ret;
    assert(typeof allocator == "number", "allocate no longer takes a type argument");
    assert(typeof slab != "number", "allocate no longer takes a number as arg0");
    if (allocator == ALLOC_STACK) {
        ret = stackAlloc(slab.length)
    } else {
        ret = _malloc(slab.length)
    }
    if (!slab.subarray && !slab.slice) {
        slab = new Uint8Array(slab)
    }
    HEAPU8.set(slab, ret >>> 0);
    return ret
}
var FSNode = function(parent, name, mode, rdev) {
    if (!parent) {
        parent = this
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev
};
var readMode = 292 | 73;
var writeMode = 146;
Object.defineProperties(FSNode.prototype, {
    read: {
        get: function() {
            return (this.mode & readMode) === readMode
        },
        set: function(val) {
            val ? this.mode |= readMode : this.mode &= ~readMode
        }
    },
    write: {
        get: function() {
            return (this.mode & writeMode) === writeMode
        },
        set: function(val) {
            val ? this.mode |= writeMode : this.mode &= ~writeMode
        }
    },
    isFolder: {
        get: function() {
            return FS.isDir(this.mode)
        }
    },
    isDevice: {
        get: function() {
            return FS.isChrdev(this.mode)
        }
    }
});
FS.FSNode = FSNode;
FS.createPreloadedFile = FS_createPreloadedFile;
FS.staticInit();
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_unlink"] = FS.unlink;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createDevice"] = FS.createDevice;
ERRNO_CODES = {
    "EPERM": 63,
    "ENOENT": 44,
    "ESRCH": 71,
    "EINTR": 27,
    "EIO": 29,
    "ENXIO": 60,
    "E2BIG": 1,
    "ENOEXEC": 45,
    "EBADF": 8,
    "ECHILD": 12,
    "EAGAIN": 6,
    "EWOULDBLOCK": 6,
    "ENOMEM": 48,
    "EACCES": 2,
    "EFAULT": 21,
    "ENOTBLK": 105,
    "EBUSY": 10,
    "EEXIST": 20,
    "EXDEV": 75,
    "ENODEV": 43,
    "ENOTDIR": 54,
    "EISDIR": 31,
    "EINVAL": 28,
    "ENFILE": 41,
    "EMFILE": 33,
    "ENOTTY": 59,
    "ETXTBSY": 74,
    "EFBIG": 22,
    "ENOSPC": 51,
    "ESPIPE": 70,
    "EROFS": 69,
    "EMLINK": 34,
    "EPIPE": 64,
    "EDOM": 18,
    "ERANGE": 68,
    "ENOMSG": 49,
    "EIDRM": 24,
    "ECHRNG": 106,
    "EL2NSYNC": 156,
    "EL3HLT": 107,
    "EL3RST": 108,
    "ELNRNG": 109,
    "EUNATCH": 110,
    "ENOCSI": 111,
    "EL2HLT": 112,
    "EDEADLK": 16,
    "ENOLCK": 46,
    "EBADE": 113,
    "EBADR": 114,
    "EXFULL": 115,
    "ENOANO": 104,
    "EBADRQC": 103,
    "EBADSLT": 102,
    "EDEADLOCK": 16,
    "EBFONT": 101,
    "ENOSTR": 100,
    "ENODATA": 116,
    "ETIME": 117,
    "ENOSR": 118,
    "ENONET": 119,
    "ENOPKG": 120,
    "EREMOTE": 121,
    "ENOLINK": 47,
    "EADV": 122,
    "ESRMNT": 123,
    "ECOMM": 124,
    "EPROTO": 65,
    "EMULTIHOP": 36,
    "EDOTDOT": 125,
    "EBADMSG": 9,
    "ENOTUNIQ": 126,
    "EBADFD": 127,
    "EREMCHG": 128,
    "ELIBACC": 129,
    "ELIBBAD": 130,
    "ELIBSCN": 131,
    "ELIBMAX": 132,
    "ELIBEXEC": 133,
    "ENOSYS": 52,
    "ENOTEMPTY": 55,
    "ENAMETOOLONG": 37,
    "ELOOP": 32,
    "EOPNOTSUPP": 138,
    "EPFNOSUPPORT": 139,
    "ECONNRESET": 15,
    "ENOBUFS": 42,
    "EAFNOSUPPORT": 5,
    "EPROTOTYPE": 67,
    "ENOTSOCK": 57,
    "ENOPROTOOPT": 50,
    "ESHUTDOWN": 140,
    "ECONNREFUSED": 14,
    "EADDRINUSE": 3,
    "ECONNABORTED": 13,
    "ENETUNREACH": 40,
    "ENETDOWN": 38,
    "ETIMEDOUT": 73,
    "EHOSTDOWN": 142,
    "EHOSTUNREACH": 23,
    "EINPROGRESS": 26,
    "EALREADY": 7,
    "EDESTADDRREQ": 17,
    "EMSGSIZE": 35,
    "EPROTONOSUPPORT": 66,
    "ESOCKTNOSUPPORT": 137,
    "EADDRNOTAVAIL": 4,
    "ENETRESET": 39,
    "EISCONN": 30,
    "ENOTCONN": 53,
    "ETOOMANYREFS": 141,
    "EUSERS": 136,
    "EDQUOT": 19,
    "ESTALE": 72,
    "ENOTSUP": 138,
    "ENOMEDIUM": 148,
    "EILSEQ": 25,
    "EOVERFLOW": 61,
    "ECANCELED": 11,
    "ENOTRECOVERABLE": 56,
    "EOWNERDEAD": 62,
    "ESTRPIPE": 135
};
Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas) {
    Browser.requestFullscreen(lockPointer, resizeCanvas)
};
Module["requestFullScreen"] = function Module_requestFullScreen() {
    Browser.requestFullScreen()
};
Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
    Browser.requestAnimationFrame(func)
};
Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
    Browser.setCanvasSize(width, height, noUpdates)
};
Module["pauseMainLoop"] = function Module_pauseMainLoop() {
    Browser.mainLoop.pause()
};
Module["resumeMainLoop"] = function Module_resumeMainLoop() {
    Browser.mainLoop.resume()
};
Module["getUserMedia"] = function Module_getUserMedia() {
    Browser.getUserMedia()
};
Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
    return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes)
};
var preloadedImages = {};
var preloadedAudios = {};
var GLctx;
for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));
Fetch.staticInit();
var decodeBase64 = typeof atob == "function" ? atob : function(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));
        chr1 = enc1 << 2 | enc2 >> 4;
        chr2 = (enc2 & 15) << 4 | enc3 >> 2;
        chr3 = (enc3 & 3) << 6 | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2)
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3)
        }
    } while (i < input.length);
    return output
};

function intArrayFromBase64(s) {
    if (typeof ENVIRONMENT_IS_NODE == "boolean" && ENVIRONMENT_IS_NODE) {
        var buf = Buffer.from(s, "base64");
        return new Uint8Array(buf["buffer"], buf["byteOffset"], buf["byteLength"])
    }
    try {
        var decoded = decodeBase64(s);
        var bytes = new Uint8Array(decoded.length);
        for (var i = 0; i < decoded.length; ++i) {
            bytes[i] = decoded.charCodeAt(i)
        }
        return bytes
    } catch (_) {
        throw new Error("Converting base64 string to bytes failed.")
    }
}

function checkIncomingModuleAPI() {
    ignoredModuleProp("fetchSettings")
}
var wasmImports = {
    "__assert_fail": ___assert_fail,
    "__asyncjs__readAsyncFromFileHandle": __asyncjs__readAsyncFromFileHandle,
    "__cxa_throw": ___cxa_throw,
    "__syscall_faccessat": ___syscall_faccessat,
    "__syscall_fcntl64": ___syscall_fcntl64,
    "__syscall_fstat64": ___syscall_fstat64,
    "__syscall_getdents64": ___syscall_getdents64,
    "__syscall_ioctl": ___syscall_ioctl,
    "__syscall_lstat64": ___syscall_lstat64,
    "__syscall_mkdirat": ___syscall_mkdirat,
    "__syscall_newfstatat": ___syscall_newfstatat,
    "__syscall_openat": ___syscall_openat,
    "__syscall_renameat": ___syscall_renameat,
    "__syscall_rmdir": ___syscall_rmdir,
    "__syscall_stat64": ___syscall_stat64,
    "__syscall_symlink": ___syscall_symlink,
    "__syscall_unlinkat": ___syscall_unlinkat,
    "_emscripten_fetch_free": __emscripten_fetch_free,
    "_emscripten_get_now_is_monotonic": __emscripten_get_now_is_monotonic,
    "_emscripten_throw_longjmp": __emscripten_throw_longjmp,
    "abort": _abort,
    "eglBindAPI": _eglBindAPI,
    "eglChooseConfig": _eglChooseConfig,
    "eglCreateContext": _eglCreateContext,
    "eglCreateWindowSurface": _eglCreateWindowSurface,
    "eglDestroyContext": _eglDestroyContext,
    "eglDestroySurface": _eglDestroySurface,
    "eglGetConfigAttrib": _eglGetConfigAttrib,
    "eglGetDisplay": _eglGetDisplay,
    "eglGetError": _eglGetError,
    "eglInitialize": _eglInitialize,
    "eglMakeCurrent": _eglMakeCurrent,
    "eglQueryString": _eglQueryString,
    "eglSwapBuffers": _eglSwapBuffers,
    "eglSwapInterval": _eglSwapInterval,
    "eglTerminate": _eglTerminate,
    "eglWaitGL": _eglWaitGL,
    "eglWaitNative": _eglWaitNative,
    "emscripten_asm_const_async_on_main_thread": _emscripten_asm_const_async_on_main_thread,
    "emscripten_asm_const_int": _emscripten_asm_const_int,
    "emscripten_asm_const_int_sync_on_main_thread": _emscripten_asm_const_int_sync_on_main_thread,
    "emscripten_date_now": _emscripten_date_now,
    "emscripten_exit_fullscreen": _emscripten_exit_fullscreen,
    "emscripten_exit_pointerlock": _emscripten_exit_pointerlock,
    "emscripten_get_device_pixel_ratio": _emscripten_get_device_pixel_ratio,
    "emscripten_get_element_css_size": _emscripten_get_element_css_size,
    "emscripten_get_gamepad_status": _emscripten_get_gamepad_status,
    "emscripten_get_now": _emscripten_get_now,
    "emscripten_get_num_gamepads": _emscripten_get_num_gamepads,
    "emscripten_get_screen_size": _emscripten_get_screen_size,
    "emscripten_glActiveTexture": _emscripten_glActiveTexture,
    "emscripten_glAttachShader": _emscripten_glAttachShader,
    "emscripten_glBeginQuery": _emscripten_glBeginQuery,
    "emscripten_glBeginQueryEXT": _emscripten_glBeginQueryEXT,
    "emscripten_glBeginTransformFeedback": _emscripten_glBeginTransformFeedback,
    "emscripten_glBindAttribLocation": _emscripten_glBindAttribLocation,
    "emscripten_glBindBuffer": _emscripten_glBindBuffer,
    "emscripten_glBindBufferBase": _emscripten_glBindBufferBase,
    "emscripten_glBindBufferRange": _emscripten_glBindBufferRange,
    "emscripten_glBindFramebuffer": _emscripten_glBindFramebuffer,
    "emscripten_glBindRenderbuffer": _emscripten_glBindRenderbuffer,
    "emscripten_glBindSampler": _emscripten_glBindSampler,
    "emscripten_glBindTexture": _emscripten_glBindTexture,
    "emscripten_glBindTransformFeedback": _emscripten_glBindTransformFeedback,
    "emscripten_glBindVertexArray": _emscripten_glBindVertexArray,
    "emscripten_glBindVertexArrayOES": _emscripten_glBindVertexArrayOES,
    "emscripten_glBlendColor": _emscripten_glBlendColor,
    "emscripten_glBlendEquation": _emscripten_glBlendEquation,
    "emscripten_glBlendEquationSeparate": _emscripten_glBlendEquationSeparate,
    "emscripten_glBlendFunc": _emscripten_glBlendFunc,
    "emscripten_glBlendFuncSeparate": _emscripten_glBlendFuncSeparate,
    "emscripten_glBlitFramebuffer": _emscripten_glBlitFramebuffer,
    "emscripten_glBufferData": _emscripten_glBufferData,
    "emscripten_glBufferSubData": _emscripten_glBufferSubData,
    "emscripten_glCheckFramebufferStatus": _emscripten_glCheckFramebufferStatus,
    "emscripten_glClear": _emscripten_glClear,
    "emscripten_glClearBufferfi": _emscripten_glClearBufferfi,
    "emscripten_glClearBufferfv": _emscripten_glClearBufferfv,
    "emscripten_glClearBufferiv": _emscripten_glClearBufferiv,
    "emscripten_glClearBufferuiv": _emscripten_glClearBufferuiv,
    "emscripten_glClearColor": _emscripten_glClearColor,
    "emscripten_glClearDepthf": _emscripten_glClearDepthf,
    "emscripten_glClearStencil": _emscripten_glClearStencil,
    "emscripten_glClientWaitSync": _emscripten_glClientWaitSync,
    "emscripten_glColorMask": _emscripten_glColorMask,
    "emscripten_glCompileShader": _emscripten_glCompileShader,
    "emscripten_glCompressedTexImage2D": _emscripten_glCompressedTexImage2D,
    "emscripten_glCompressedTexImage3D": _emscripten_glCompressedTexImage3D,
    "emscripten_glCompressedTexSubImage2D": _emscripten_glCompressedTexSubImage2D,
    "emscripten_glCompressedTexSubImage3D": _emscripten_glCompressedTexSubImage3D,
    "emscripten_glCopyBufferSubData": _emscripten_glCopyBufferSubData,
    "emscripten_glCopyTexImage2D": _emscripten_glCopyTexImage2D,
    "emscripten_glCopyTexSubImage2D": _emscripten_glCopyTexSubImage2D,
    "emscripten_glCopyTexSubImage3D": _emscripten_glCopyTexSubImage3D,
    "emscripten_glCreateProgram": _emscripten_glCreateProgram,
    "emscripten_glCreateShader": _emscripten_glCreateShader,
    "emscripten_glCullFace": _emscripten_glCullFace,
    "emscripten_glDeleteBuffers": _emscripten_glDeleteBuffers,
    "emscripten_glDeleteFramebuffers": _emscripten_glDeleteFramebuffers,
    "emscripten_glDeleteProgram": _emscripten_glDeleteProgram,
    "emscripten_glDeleteQueries": _emscripten_glDeleteQueries,
    "emscripten_glDeleteQueriesEXT": _emscripten_glDeleteQueriesEXT,
    "emscripten_glDeleteRenderbuffers": _emscripten_glDeleteRenderbuffers,
    "emscripten_glDeleteSamplers": _emscripten_glDeleteSamplers,
    "emscripten_glDeleteShader": _emscripten_glDeleteShader,
    "emscripten_glDeleteSync": _emscripten_glDeleteSync,
    "emscripten_glDeleteTextures": _emscripten_glDeleteTextures,
    "emscripten_glDeleteTransformFeedbacks": _emscripten_glDeleteTransformFeedbacks,
    "emscripten_glDeleteVertexArrays": _emscripten_glDeleteVertexArrays,
    "emscripten_glDeleteVertexArraysOES": _emscripten_glDeleteVertexArraysOES,
    "emscripten_glDepthFunc": _emscripten_glDepthFunc,
    "emscripten_glDepthMask": _emscripten_glDepthMask,
    "emscripten_glDepthRangef": _emscripten_glDepthRangef,
    "emscripten_glDetachShader": _emscripten_glDetachShader,
    "emscripten_glDisable": _emscripten_glDisable,
    "emscripten_glDisableVertexAttribArray": _emscripten_glDisableVertexAttribArray,
    "emscripten_glDrawArrays": _emscripten_glDrawArrays,
    "emscripten_glDrawArraysInstanced": _emscripten_glDrawArraysInstanced,
    "emscripten_glDrawArraysInstancedANGLE": _emscripten_glDrawArraysInstancedANGLE,
    "emscripten_glDrawArraysInstancedARB": _emscripten_glDrawArraysInstancedARB,
    "emscripten_glDrawArraysInstancedEXT": _emscripten_glDrawArraysInstancedEXT,
    "emscripten_glDrawArraysInstancedNV": _emscripten_glDrawArraysInstancedNV,
    "emscripten_glDrawBuffers": _emscripten_glDrawBuffers,
    "emscripten_glDrawBuffersEXT": _emscripten_glDrawBuffersEXT,
    "emscripten_glDrawBuffersWEBGL": _emscripten_glDrawBuffersWEBGL,
    "emscripten_glDrawElements": _emscripten_glDrawElements,
    "emscripten_glDrawElementsInstanced": _emscripten_glDrawElementsInstanced,
    "emscripten_glDrawElementsInstancedANGLE": _emscripten_glDrawElementsInstancedANGLE,
    "emscripten_glDrawElementsInstancedARB": _emscripten_glDrawElementsInstancedARB,
    "emscripten_glDrawElementsInstancedEXT": _emscripten_glDrawElementsInstancedEXT,
    "emscripten_glDrawElementsInstancedNV": _emscripten_glDrawElementsInstancedNV,
    "emscripten_glDrawRangeElements": _emscripten_glDrawRangeElements,
    "emscripten_glEnable": _emscripten_glEnable,
    "emscripten_glEnableVertexAttribArray": _emscripten_glEnableVertexAttribArray,
    "emscripten_glEndQuery": _emscripten_glEndQuery,
    "emscripten_glEndQueryEXT": _emscripten_glEndQueryEXT,
    "emscripten_glEndTransformFeedback": _emscripten_glEndTransformFeedback,
    "emscripten_glFenceSync": _emscripten_glFenceSync,
    "emscripten_glFinish": _emscripten_glFinish,
    "emscripten_glFlush": _emscripten_glFlush,
    "emscripten_glFlushMappedBufferRange": _emscripten_glFlushMappedBufferRange,
    "emscripten_glFramebufferRenderbuffer": _emscripten_glFramebufferRenderbuffer,
    "emscripten_glFramebufferTexture2D": _emscripten_glFramebufferTexture2D,
    "emscripten_glFramebufferTextureLayer": _emscripten_glFramebufferTextureLayer,
    "emscripten_glFrontFace": _emscripten_glFrontFace,
    "emscripten_glGenBuffers": _emscripten_glGenBuffers,
    "emscripten_glGenFramebuffers": _emscripten_glGenFramebuffers,
    "emscripten_glGenQueries": _emscripten_glGenQueries,
    "emscripten_glGenQueriesEXT": _emscripten_glGenQueriesEXT,
    "emscripten_glGenRenderbuffers": _emscripten_glGenRenderbuffers,
    "emscripten_glGenSamplers": _emscripten_glGenSamplers,
    "emscripten_glGenTextures": _emscripten_glGenTextures,
    "emscripten_glGenTransformFeedbacks": _emscripten_glGenTransformFeedbacks,
    "emscripten_glGenVertexArrays": _emscripten_glGenVertexArrays,
    "emscripten_glGenVertexArraysOES": _emscripten_glGenVertexArraysOES,
    "emscripten_glGenerateMipmap": _emscripten_glGenerateMipmap,
    "emscripten_glGetActiveAttrib": _emscripten_glGetActiveAttrib,
    "emscripten_glGetActiveUniform": _emscripten_glGetActiveUniform,
    "emscripten_glGetActiveUniformBlockName": _emscripten_glGetActiveUniformBlockName,
    "emscripten_glGetActiveUniformBlockiv": _emscripten_glGetActiveUniformBlockiv,
    "emscripten_glGetActiveUniformsiv": _emscripten_glGetActiveUniformsiv,
    "emscripten_glGetAttachedShaders": _emscripten_glGetAttachedShaders,
    "emscripten_glGetAttribLocation": _emscripten_glGetAttribLocation,
    "emscripten_glGetBooleanv": _emscripten_glGetBooleanv,
    "emscripten_glGetBufferParameteri64v": _emscripten_glGetBufferParameteri64v,
    "emscripten_glGetBufferParameteriv": _emscripten_glGetBufferParameteriv,
    "emscripten_glGetBufferPointerv": _emscripten_glGetBufferPointerv,
    "emscripten_glGetError": _emscripten_glGetError,
    "emscripten_glGetFloatv": _emscripten_glGetFloatv,
    "emscripten_glGetFragDataLocation": _emscripten_glGetFragDataLocation,
    "emscripten_glGetFramebufferAttachmentParameteriv": _emscripten_glGetFramebufferAttachmentParameteriv,
    "emscripten_glGetInteger64i_v": _emscripten_glGetInteger64i_v,
    "emscripten_glGetInteger64v": _emscripten_glGetInteger64v,
    "emscripten_glGetIntegeri_v": _emscripten_glGetIntegeri_v,
    "emscripten_glGetIntegerv": _emscripten_glGetIntegerv,
    "emscripten_glGetInternalformativ": _emscripten_glGetInternalformativ,
    "emscripten_glGetProgramBinary": _emscripten_glGetProgramBinary,
    "emscripten_glGetProgramInfoLog": _emscripten_glGetProgramInfoLog,
    "emscripten_glGetProgramiv": _emscripten_glGetProgramiv,
    "emscripten_glGetQueryObjecti64vEXT": _emscripten_glGetQueryObjecti64vEXT,
    "emscripten_glGetQueryObjectivEXT": _emscripten_glGetQueryObjectivEXT,
    "emscripten_glGetQueryObjectui64vEXT": _emscripten_glGetQueryObjectui64vEXT,
    "emscripten_glGetQueryObjectuiv": _emscripten_glGetQueryObjectuiv,
    "emscripten_glGetQueryObjectuivEXT": _emscripten_glGetQueryObjectuivEXT,
    "emscripten_glGetQueryiv": _emscripten_glGetQueryiv,
    "emscripten_glGetQueryivEXT": _emscripten_glGetQueryivEXT,
    "emscripten_glGetRenderbufferParameteriv": _emscripten_glGetRenderbufferParameteriv,
    "emscripten_glGetSamplerParameterfv": _emscripten_glGetSamplerParameterfv,
    "emscripten_glGetSamplerParameteriv": _emscripten_glGetSamplerParameteriv,
    "emscripten_glGetShaderInfoLog": _emscripten_glGetShaderInfoLog,
    "emscripten_glGetShaderPrecisionFormat": _emscripten_glGetShaderPrecisionFormat,
    "emscripten_glGetShaderSource": _emscripten_glGetShaderSource,
    "emscripten_glGetShaderiv": _emscripten_glGetShaderiv,
    "emscripten_glGetString": _emscripten_glGetString,
    "emscripten_glGetStringi": _emscripten_glGetStringi,
    "emscripten_glGetSynciv": _emscripten_glGetSynciv,
    "emscripten_glGetTexParameterfv": _emscripten_glGetTexParameterfv,
    "emscripten_glGetTexParameteriv": _emscripten_glGetTexParameteriv,
    "emscripten_glGetTransformFeedbackVarying": _emscripten_glGetTransformFeedbackVarying,
    "emscripten_glGetUniformBlockIndex": _emscripten_glGetUniformBlockIndex,
    "emscripten_glGetUniformIndices": _emscripten_glGetUniformIndices,
    "emscripten_glGetUniformLocation": _emscripten_glGetUniformLocation,
    "emscripten_glGetUniformfv": _emscripten_glGetUniformfv,
    "emscripten_glGetUniformiv": _emscripten_glGetUniformiv,
    "emscripten_glGetUniformuiv": _emscripten_glGetUniformuiv,
    "emscripten_glGetVertexAttribIiv": _emscripten_glGetVertexAttribIiv,
    "emscripten_glGetVertexAttribIuiv": _emscripten_glGetVertexAttribIuiv,
    "emscripten_glGetVertexAttribPointerv": _emscripten_glGetVertexAttribPointerv,
    "emscripten_glGetVertexAttribfv": _emscripten_glGetVertexAttribfv,
    "emscripten_glGetVertexAttribiv": _emscripten_glGetVertexAttribiv,
    "emscripten_glHint": _emscripten_glHint,
    "emscripten_glInvalidateFramebuffer": _emscripten_glInvalidateFramebuffer,
    "emscripten_glInvalidateSubFramebuffer": _emscripten_glInvalidateSubFramebuffer,
    "emscripten_glIsBuffer": _emscripten_glIsBuffer,
    "emscripten_glIsEnabled": _emscripten_glIsEnabled,
    "emscripten_glIsFramebuffer": _emscripten_glIsFramebuffer,
    "emscripten_glIsProgram": _emscripten_glIsProgram,
    "emscripten_glIsQuery": _emscripten_glIsQuery,
    "emscripten_glIsQueryEXT": _emscripten_glIsQueryEXT,
    "emscripten_glIsRenderbuffer": _emscripten_glIsRenderbuffer,
    "emscripten_glIsSampler": _emscripten_glIsSampler,
    "emscripten_glIsShader": _emscripten_glIsShader,
    "emscripten_glIsSync": _emscripten_glIsSync,
    "emscripten_glIsTexture": _emscripten_glIsTexture,
    "emscripten_glIsTransformFeedback": _emscripten_glIsTransformFeedback,
    "emscripten_glIsVertexArray": _emscripten_glIsVertexArray,
    "emscripten_glIsVertexArrayOES": _emscripten_glIsVertexArrayOES,
    "emscripten_glLineWidth": _emscripten_glLineWidth,
    "emscripten_glLinkProgram": _emscripten_glLinkProgram,
    "emscripten_glMapBufferRange": _emscripten_glMapBufferRange,
    "emscripten_glPauseTransformFeedback": _emscripten_glPauseTransformFeedback,
    "emscripten_glPixelStorei": _emscripten_glPixelStorei,
    "emscripten_glPolygonOffset": _emscripten_glPolygonOffset,
    "emscripten_glProgramBinary": _emscripten_glProgramBinary,
    "emscripten_glProgramParameteri": _emscripten_glProgramParameteri,
    "emscripten_glQueryCounterEXT": _emscripten_glQueryCounterEXT,
    "emscripten_glReadBuffer": _emscripten_glReadBuffer,
    "emscripten_glReadPixels": _emscripten_glReadPixels,
    "emscripten_glReleaseShaderCompiler": _emscripten_glReleaseShaderCompiler,
    "emscripten_glRenderbufferStorage": _emscripten_glRenderbufferStorage,
    "emscripten_glRenderbufferStorageMultisample": _emscripten_glRenderbufferStorageMultisample,
    "emscripten_glResumeTransformFeedback": _emscripten_glResumeTransformFeedback,
    "emscripten_glSampleCoverage": _emscripten_glSampleCoverage,
    "emscripten_glSamplerParameterf": _emscripten_glSamplerParameterf,
    "emscripten_glSamplerParameterfv": _emscripten_glSamplerParameterfv,
    "emscripten_glSamplerParameteri": _emscripten_glSamplerParameteri,
    "emscripten_glSamplerParameteriv": _emscripten_glSamplerParameteriv,
    "emscripten_glScissor": _emscripten_glScissor,
    "emscripten_glShaderBinary": _emscripten_glShaderBinary,
    "emscripten_glShaderSource": _emscripten_glShaderSource,
    "emscripten_glStencilFunc": _emscripten_glStencilFunc,
    "emscripten_glStencilFuncSeparate": _emscripten_glStencilFuncSeparate,
    "emscripten_glStencilMask": _emscripten_glStencilMask,
    "emscripten_glStencilMaskSeparate": _emscripten_glStencilMaskSeparate,
    "emscripten_glStencilOp": _emscripten_glStencilOp,
    "emscripten_glStencilOpSeparate": _emscripten_glStencilOpSeparate,
    "emscripten_glTexImage2D": _emscripten_glTexImage2D,
    "emscripten_glTexImage3D": _emscripten_glTexImage3D,
    "emscripten_glTexParameterf": _emscripten_glTexParameterf,
    "emscripten_glTexParameterfv": _emscripten_glTexParameterfv,
    "emscripten_glTexParameteri": _emscripten_glTexParameteri,
    "emscripten_glTexParameteriv": _emscripten_glTexParameteriv,
    "emscripten_glTexStorage2D": _emscripten_glTexStorage2D,
    "emscripten_glTexStorage3D": _emscripten_glTexStorage3D,
    "emscripten_glTexSubImage2D": _emscripten_glTexSubImage2D,
    "emscripten_glTexSubImage3D": _emscripten_glTexSubImage3D,
    "emscripten_glTransformFeedbackVaryings": _emscripten_glTransformFeedbackVaryings,
    "emscripten_glUniform1f": _emscripten_glUniform1f,
    "emscripten_glUniform1fv": _emscripten_glUniform1fv,
    "emscripten_glUniform1i": _emscripten_glUniform1i,
    "emscripten_glUniform1iv": _emscripten_glUniform1iv,
    "emscripten_glUniform1ui": _emscripten_glUniform1ui,
    "emscripten_glUniform1uiv": _emscripten_glUniform1uiv,
    "emscripten_glUniform2f": _emscripten_glUniform2f,
    "emscripten_glUniform2fv": _emscripten_glUniform2fv,
    "emscripten_glUniform2i": _emscripten_glUniform2i,
    "emscripten_glUniform2iv": _emscripten_glUniform2iv,
    "emscripten_glUniform2ui": _emscripten_glUniform2ui,
    "emscripten_glUniform2uiv": _emscripten_glUniform2uiv,
    "emscripten_glUniform3f": _emscripten_glUniform3f,
    "emscripten_glUniform3fv": _emscripten_glUniform3fv,
    "emscripten_glUniform3i": _emscripten_glUniform3i,
    "emscripten_glUniform3iv": _emscripten_glUniform3iv,
    "emscripten_glUniform3ui": _emscripten_glUniform3ui,
    "emscripten_glUniform3uiv": _emscripten_glUniform3uiv,
    "emscripten_glUniform4f": _emscripten_glUniform4f,
    "emscripten_glUniform4fv": _emscripten_glUniform4fv,
    "emscripten_glUniform4i": _emscripten_glUniform4i,
    "emscripten_glUniform4iv": _emscripten_glUniform4iv,
    "emscripten_glUniform4ui": _emscripten_glUniform4ui,
    "emscripten_glUniform4uiv": _emscripten_glUniform4uiv,
    "emscripten_glUniformBlockBinding": _emscripten_glUniformBlockBinding,
    "emscripten_glUniformMatrix2fv": _emscripten_glUniformMatrix2fv,
    "emscripten_glUniformMatrix2x3fv": _emscripten_glUniformMatrix2x3fv,
    "emscripten_glUniformMatrix2x4fv": _emscripten_glUniformMatrix2x4fv,
    "emscripten_glUniformMatrix3fv": _emscripten_glUniformMatrix3fv,
    "emscripten_glUniformMatrix3x2fv": _emscripten_glUniformMatrix3x2fv,
    "emscripten_glUniformMatrix3x4fv": _emscripten_glUniformMatrix3x4fv,
    "emscripten_glUniformMatrix4fv": _emscripten_glUniformMatrix4fv,
    "emscripten_glUniformMatrix4x2fv": _emscripten_glUniformMatrix4x2fv,
    "emscripten_glUniformMatrix4x3fv": _emscripten_glUniformMatrix4x3fv,
    "emscripten_glUnmapBuffer": _emscripten_glUnmapBuffer,
    "emscripten_glUseProgram": _emscripten_glUseProgram,
    "emscripten_glValidateProgram": _emscripten_glValidateProgram,
    "emscripten_glVertexAttrib1f": _emscripten_glVertexAttrib1f,
    "emscripten_glVertexAttrib1fv": _emscripten_glVertexAttrib1fv,
    "emscripten_glVertexAttrib2f": _emscripten_glVertexAttrib2f,
    "emscripten_glVertexAttrib2fv": _emscripten_glVertexAttrib2fv,
    "emscripten_glVertexAttrib3f": _emscripten_glVertexAttrib3f,
    "emscripten_glVertexAttrib3fv": _emscripten_glVertexAttrib3fv,
    "emscripten_glVertexAttrib4f": _emscripten_glVertexAttrib4f,
    "emscripten_glVertexAttrib4fv": _emscripten_glVertexAttrib4fv,
    "emscripten_glVertexAttribDivisor": _emscripten_glVertexAttribDivisor,
    "emscripten_glVertexAttribDivisorANGLE": _emscripten_glVertexAttribDivisorANGLE,
    "emscripten_glVertexAttribDivisorARB": _emscripten_glVertexAttribDivisorARB,
    "emscripten_glVertexAttribDivisorEXT": _emscripten_glVertexAttribDivisorEXT,
    "emscripten_glVertexAttribDivisorNV": _emscripten_glVertexAttribDivisorNV,
    "emscripten_glVertexAttribI4i": _emscripten_glVertexAttribI4i,
    "emscripten_glVertexAttribI4iv": _emscripten_glVertexAttribI4iv,
    "emscripten_glVertexAttribI4ui": _emscripten_glVertexAttribI4ui,
    "emscripten_glVertexAttribI4uiv": _emscripten_glVertexAttribI4uiv,
    "emscripten_glVertexAttribIPointer": _emscripten_glVertexAttribIPointer,
    "emscripten_glVertexAttribPointer": _emscripten_glVertexAttribPointer,
    "emscripten_glViewport": _emscripten_glViewport,
    "emscripten_glWaitSync": _emscripten_glWaitSync,
    "emscripten_has_asyncify": _emscripten_has_asyncify,
    "emscripten_is_main_browser_thread": _emscripten_is_main_browser_thread,
    "emscripten_memcpy_big": _emscripten_memcpy_big,
    "emscripten_request_fullscreen_strategy": _emscripten_request_fullscreen_strategy,
    "emscripten_request_pointerlock": _emscripten_request_pointerlock,
    "emscripten_resize_heap": _emscripten_resize_heap,
    "emscripten_sample_gamepad_data": _emscripten_sample_gamepad_data,
    "emscripten_set_beforeunload_callback_on_thread": _emscripten_set_beforeunload_callback_on_thread,
    "emscripten_set_blur_callback_on_thread": _emscripten_set_blur_callback_on_thread,
    "emscripten_set_canvas_element_size": _emscripten_set_canvas_element_size,
    "emscripten_set_element_css_size": _emscripten_set_element_css_size,
    "emscripten_set_focus_callback_on_thread": _emscripten_set_focus_callback_on_thread,
    "emscripten_set_fullscreenchange_callback_on_thread": _emscripten_set_fullscreenchange_callback_on_thread,
    "emscripten_set_gamepadconnected_callback_on_thread": _emscripten_set_gamepadconnected_callback_on_thread,
    "emscripten_set_gamepaddisconnected_callback_on_thread": _emscripten_set_gamepaddisconnected_callback_on_thread,
    "emscripten_set_keydown_callback_on_thread": _emscripten_set_keydown_callback_on_thread,
    "emscripten_set_keypress_callback_on_thread": _emscripten_set_keypress_callback_on_thread,
    "emscripten_set_keyup_callback_on_thread": _emscripten_set_keyup_callback_on_thread,
    "emscripten_set_main_loop": _emscripten_set_main_loop,
    "emscripten_set_mousedown_callback_on_thread": _emscripten_set_mousedown_callback_on_thread,
    "emscripten_set_mouseenter_callback_on_thread": _emscripten_set_mouseenter_callback_on_thread,
    "emscripten_set_mouseleave_callback_on_thread": _emscripten_set_mouseleave_callback_on_thread,
    "emscripten_set_mousemove_callback_on_thread": _emscripten_set_mousemove_callback_on_thread,
    "emscripten_set_mouseup_callback_on_thread": _emscripten_set_mouseup_callback_on_thread,
    "emscripten_set_pointerlockchange_callback_on_thread": _emscripten_set_pointerlockchange_callback_on_thread,
    "emscripten_set_resize_callback_on_thread": _emscripten_set_resize_callback_on_thread,
    "emscripten_set_touchcancel_callback_on_thread": _emscripten_set_touchcancel_callback_on_thread,
    "emscripten_set_touchend_callback_on_thread": _emscripten_set_touchend_callback_on_thread,
    "emscripten_set_touchmove_callback_on_thread": _emscripten_set_touchmove_callback_on_thread,
    "emscripten_set_touchstart_callback_on_thread": _emscripten_set_touchstart_callback_on_thread,
    "emscripten_set_visibilitychange_callback_on_thread": _emscripten_set_visibilitychange_callback_on_thread,
    "emscripten_set_wheel_callback_on_thread": _emscripten_set_wheel_callback_on_thread,
    "emscripten_set_window_title": _emscripten_set_window_title,
    "emscripten_sleep": _emscripten_sleep,
    "emscripten_start_fetch": _emscripten_start_fetch,
    "environ_get": _environ_get,
    "environ_sizes_get": _environ_sizes_get,
    "fd_close": _fd_close,
    "fd_read": _fd_read,
    "fd_seek": _fd_seek,
    "fd_write": _fd_write,
    "glActiveTexture": _glActiveTexture,
    "glAttachShader": _glAttachShader,
    "glBindAttribLocation": _glBindAttribLocation,
    "glBindBuffer": _glBindBuffer,
    "glBindBufferRange": _glBindBufferRange,
    "glBindFramebuffer": _glBindFramebuffer,
    "glBindRenderbuffer": _glBindRenderbuffer,
    "glBindTexture": _glBindTexture,
    "glBlendColor": _glBlendColor,
    "glBlendEquation": _glBlendEquation,
    "glBlendEquationSeparate": _glBlendEquationSeparate,
    "glBlendFunc": _glBlendFunc,
    "glBlendFuncSeparate": _glBlendFuncSeparate,
    "glBlitFramebuffer": _glBlitFramebuffer,
    "glBufferData": _glBufferData,
    "glCheckFramebufferStatus": _glCheckFramebufferStatus,
    "glClear": _glClear,
    "glClearColor": _glClearColor,
    "glColorMask": _glColorMask,
    "glCompileShader": _glCompileShader,
    "glCopyTexImage2D": _glCopyTexImage2D,
    "glCreateProgram": _glCreateProgram,
    "glCreateShader": _glCreateShader,
    "glCullFace": _glCullFace,
    "glDeleteBuffers": _glDeleteBuffers,
    "glDeleteFramebuffers": _glDeleteFramebuffers,
    "glDeleteProgram": _glDeleteProgram,
    "glDeleteRenderbuffers": _glDeleteRenderbuffers,
    "glDeleteShader": _glDeleteShader,
    "glDeleteTextures": _glDeleteTextures,
    "glDetachShader": _glDetachShader,
    "glDisable": _glDisable,
    "glDisableVertexAttribArray": _glDisableVertexAttribArray,
    "glDrawArrays": _glDrawArrays,
    "glEnable": _glEnable,
    "glEnableVertexAttribArray": _glEnableVertexAttribArray,
    "glFinish": _glFinish,
    "glFramebufferRenderbuffer": _glFramebufferRenderbuffer,
    "glFramebufferTexture2D": _glFramebufferTexture2D,
    "glFrontFace": _glFrontFace,
    "glGenBuffers": _glGenBuffers,
    "glGenFramebuffers": _glGenFramebuffers,
    "glGenRenderbuffers": _glGenRenderbuffers,
    "glGenTextures": _glGenTextures,
    "glGenerateMipmap": _glGenerateMipmap,
    "glGetAttribLocation": _glGetAttribLocation,
    "glGetError": _glGetError,
    "glGetIntegerv": _glGetIntegerv,
    "glGetProgramInfoLog": _glGetProgramInfoLog,
    "glGetProgramiv": _glGetProgramiv,
    "glGetShaderInfoLog": _glGetShaderInfoLog,
    "glGetShaderiv": _glGetShaderiv,
    "glGetString": _glGetString,
    "glGetUniformBlockIndex": _glGetUniformBlockIndex,
    "glGetUniformLocation": _glGetUniformLocation,
    "glLineWidth": _glLineWidth,
    "glLinkProgram": _glLinkProgram,
    "glPixelStorei": _glPixelStorei,
    "glReadPixels": _glReadPixels,
    "glRenderbufferStorage": _glRenderbufferStorage,
    "glRenderbufferStorageMultisample": _glRenderbufferStorageMultisample,
    "glScissor": _glScissor,
    "glShaderSource": _glShaderSource,
    "glStencilFunc": _glStencilFunc,
    "glStencilMask": _glStencilMask,
    "glStencilOp": _glStencilOp,
    "glStencilOpSeparate": _glStencilOpSeparate,
    "glTexImage2D": _glTexImage2D,
    "glTexImage3D": _glTexImage3D,
    "glTexParameteri": _glTexParameteri,
    "glTexSubImage2D": _glTexSubImage2D,
    "glUniform1f": _glUniform1f,
    "glUniform1i": _glUniform1i,
    "glUniform2f": _glUniform2f,
    "glUniform2fv": _glUniform2fv,
    "glUniform3f": _glUniform3f,
    "glUniform4f": _glUniform4f,
    "glUniformBlockBinding": _glUniformBlockBinding,
    "glUniformMatrix2fv": _glUniformMatrix2fv,
    "glUniformMatrix4fv": _glUniformMatrix4fv,
    "glUseProgram": _glUseProgram,
    "glVertexAttribPointer": _glVertexAttribPointer,
    "glViewport": _glViewport,
    "invoke_iii": invoke_iii,
    "invoke_iiii": invoke_iiii,
    "invoke_iiiii": invoke_iiiii,
    "invoke_vi": invoke_vi,
    "invoke_viiii": invoke_viiii,
    "jsAddVideoInstance": jsAddVideoInstance,
    "jsCanAcceptAudioFrame": jsCanAcceptAudioFrame,
    "jsCanAcceptVideoFrame": jsCanAcceptVideoFrame,
    "jsCreateFileInput": jsCreateFileInput,
    "jsCreateVideoForFilePath": jsCreateVideoForFilePath,
    "jsCreateVideoForGUHandle": jsCreateVideoForGUHandle,
    "jsFFmpegDecodeFrame": jsFFmpegDecodeFrame,
    "jsFFmpegOpenForDecoding": jsFFmpegOpenForDecoding,
    "jsGetCanvasTargetHeight": jsGetCanvasTargetHeight,
    "jsGetCanvasTargetWidth": jsGetCanvasTargetWidth,
    "jsGetDevicePixelRatio": jsGetDevicePixelRatio,
    "jsGetVideoDuration": jsGetVideoDuration,
    "jsGetVideoHeight": jsGetVideoHeight,
    "jsGetVideoTexture2": jsGetVideoTexture2,
    "jsGetVideoWidth": jsGetVideoWidth,
    "jsOfferFileToDownload": jsOfferFileToDownload,
    "jsOpenURLInNewWindow": jsOpenURLInNewWindow,
    "jsPlayVideo": jsPlayVideo,
    "jsSeekVideo": jsSeekVideo,
    "jsSeekVideo2": jsSeekVideo2,
    "jsSetupAudioJSCodec": jsSetupAudioJSCodec,
    "jsSetupMsgHandlers": jsSetupMsgHandlers,
    "jsSetupVideoJSCodec": jsSetupVideoJSCodec,
    "jsShowOpenFileDialog": jsShowOpenFileDialog,
    "jsStopVideo": jsStopVideo,
    "jsStoreTextToCopy": jsStoreTextToCopy,
    "jsTextureWithEmoji": jsTextureWithEmoji,
    "jsUseCursor": jsUseCursor,
    "strftime_l": _strftime_l
};
Asyncify.instrumentWasmImports(wasmImports);
var asm = createWasm();
var ___wasm_call_ctors = createExportWrapper("__wasm_call_ctors");
var _toggle_background_color = Module["_toggle_background_color"] = createExportWrapper("toggle_background_color");
var _jsMouseDown = Module["_jsMouseDown"] = createExportWrapper("jsMouseDown");
var _jsMouseUp = Module["_jsMouseUp"] = createExportWrapper("jsMouseUp");
var _jsMouseMove = Module["_jsMouseMove"] = createExportWrapper("jsMouseMove");
var _jsMouseLeave = Module["_jsMouseLeave"] = createExportWrapper("jsMouseLeave");
var _jsTouchStart = Module["_jsTouchStart"] = createExportWrapper("jsTouchStart");
var _jsTouchMove = Module["_jsTouchMove"] = createExportWrapper("jsTouchMove");
var _jsTouchEnd = Module["_jsTouchEnd"] = createExportWrapper("jsTouchEnd");
var _jsTouchCancel = Module["_jsTouchCancel"] = createExportWrapper("jsTouchCancel");
var _jsWheelEvent = Module["_jsWheelEvent"] = createExportWrapper("jsWheelEvent");
var _jsWindowResized = Module["_jsWindowResized"] = createExportWrapper("jsWindowResized");
var _jsSetupUIEventHandlers = Module["_jsSetupUIEventHandlers"] = createExportWrapper("jsSetupUIEventHandlers");
var _guRunTasks = Module["_guRunTasks"] = createExportWrapper("guRunTasks");
var _setupEmscriptenWebGL = Module["_setupEmscriptenWebGL"] = createExportWrapper("setupEmscriptenWebGL");
var _openVideoFileForTranscription = Module["_openVideoFileForTranscription"] = createExportWrapper("openVideoFileForTranscription");
var _openMediaFile = Module["_openMediaFile"] = createExportWrapper("openMediaFile");
var _writeJSONToLayer = Module["_writeJSONToLayer"] = createExportWrapper("writeJSONToLayer");
var _readJSONFromLayer = Module["_readJSONFromLayer"] = createExportWrapper("readJSONFromLayer");
var _embedded_play = Module["_embedded_play"] = createExportWrapper("embedded_play");
var _embedded_stop = Module["_embedded_stop"] = createExportWrapper("embedded_stop");
var _embedded_seek = Module["_embedded_seek"] = createExportWrapper("embedded_seek");
var _embedded_opendialog = Module["_embedded_opendialog"] = createExportWrapper("embedded_opendialog");
var _embedded_export = Module["_embedded_export"] = createExportWrapper("embedded_export");
var _embedded_getAllLayers = Module["_embedded_getAllLayers"] = createExportWrapper("embedded_getAllLayers");
var _gdriveFileOpenCallback = Module["_gdriveFileOpenCallback"] = createExportWrapper("gdriveFileOpenCallback");
var _gdriveFileOpenLinkCallback = Module["_gdriveFileOpenLinkCallback"] = createExportWrapper("gdriveFileOpenLinkCallback");
var _main = createExportWrapper("main");
var _malloc = Module["_malloc"] = createExportWrapper("malloc");
var _free = Module["_free"] = createExportWrapper("free");
var _startFileHandleReadForFFmpeg = Module["_startFileHandleReadForFFmpeg"] = createExportWrapper("startFileHandleReadForFFmpeg");
var _jsFFWorkerFinishedLoading = Module["_jsFFWorkerFinishedLoading"] = createExportWrapper("jsFFWorkerFinishedLoading");
var _jsFFmpegModuleFinishedLoading = Module["_jsFFmpegModuleFinishedLoading"] = createExportWrapper("jsFFmpegModuleFinishedLoading");
var _jsPassWCAudio_f32 = Module["_jsPassWCAudio_f32"] = createExportWrapper("jsPassWCAudio_f32");
var _jsPassWCAudio_s16 = Module["_jsPassWCAudio_s16"] = createExportWrapper("jsPassWCAudio_s16");
var _jsHandleVideoDecoderClosedOutOfQuotaError = Module["_jsHandleVideoDecoderClosedOutOfQuotaError"] = createExportWrapper("jsHandleVideoDecoderClosedOutOfQuotaError");
var _jsHandleAudioDecoderClosedOutOfQuotaError = Module["_jsHandleAudioDecoderClosedOutOfQuotaError"] = createExportWrapper("jsHandleAudioDecoderClosedOutOfQuotaError");
var _jsHandleAudioDecoderOperationError = Module["_jsHandleAudioDecoderOperationError"] = createExportWrapper("jsHandleAudioDecoderOperationError");
var _jsInvalidateKeyFrame = Module["_jsInvalidateKeyFrame"] = createExportWrapper("jsInvalidateKeyFrame");
var _jsHandleVideoDecodeError = Module["_jsHandleVideoDecodeError"] = createExportWrapper("jsHandleVideoDecodeError");
var _webCodecsFinishedFlush = Module["_webCodecsFinishedFlush"] = createExportWrapper("webCodecsFinishedFlush");
var _webCodecsGotDecodedFrame = Module["_webCodecsGotDecodedFrame"] = createExportWrapper("webCodecsGotDecodedFrame");
var _webCodecsFrameCopiedToGLTex = Module["_webCodecsFrameCopiedToGLTex"] = createExportWrapper("webCodecsFrameCopiedToGLTex");
var _webCodecsFlushPromiseResolved = Module["_webCodecsFlushPromiseResolved"] = createExportWrapper("webCodecsFlushPromiseResolved");
var _jsPassVideoAudio2 = Module["_jsPassVideoAudio2"] = createExportWrapper("jsPassVideoAudio2");
var _jsLoadFileProgressCallback = Module["_jsLoadFileProgressCallback"] = createExportWrapper("jsLoadFileProgressCallback");
var _jsFFFallbackFinishedLoading = Module["_jsFFFallbackFinishedLoading"] = createExportWrapper("jsFFFallbackFinishedLoading");
var _guVideoFFLoadFinished = Module["_guVideoFFLoadFinished"] = createExportWrapper("guVideoFFLoadFinished");
var _supportCheckJSResult = Module["_supportCheckJSResult"] = createExportWrapper("supportCheckJSResult");
var _videoDecoderWatchdog = Module["_videoDecoderWatchdog"] = createExportWrapper("videoDecoderWatchdog");
var _processRequestListFromMainThread = Module["_processRequestListFromMainThread"] = createExportWrapper("processRequestListFromMainThread");
var _audioSplitDoneCallback = Module["_audioSplitDoneCallback"] = createExportWrapper("audioSplitDoneCallback");
var _videoputrequestprogress = Module["_videoputrequestprogress"] = createExportWrapper("videoputrequestprogress");
var _jsAudioFlushDone = Module["_jsAudioFlushDone"] = createExportWrapper("jsAudioFlushDone");
var _ffAudioReadResultCallback = Module["_ffAudioReadResultCallback"] = createExportWrapper("ffAudioReadResultCallback");
var _GUVideosRunTasks = Module["_GUVideosRunTasks"] = createExportWrapper("GUVideosRunTasks");
var _getNewGLTexture = Module["_getNewGLTexture"] = createExportWrapper("getNewGLTexture");
var _ffPassDecodedFrame = Module["_ffPassDecodedFrame"] = createExportWrapper("ffPassDecodedFrame");
var _jsVideoSeeked = Module["_jsVideoSeeked"] = createExportWrapper("jsVideoSeeked");
var _jsPassVideoAudio = Module["_jsPassVideoAudio"] = createExportWrapper("jsPassVideoAudio");
var _jsVideoInputGotData = Module["_jsVideoInputGotData"] = createExportWrapper("jsVideoInputGotData");
var _jsVideoLoaded = Module["_jsVideoLoaded"] = createExportWrapper("jsVideoLoaded");
var _jsGetNextFileHandleID = Module["_jsGetNextFileHandleID"] = createExportWrapper("jsGetNextFileHandleID");
var _ffwcCheckForTask = Module["_ffwcCheckForTask"] = createExportWrapper("ffwcCheckForTask");
var _wcFrameEncoded = Module["_wcFrameEncoded"] = createExportWrapper("wcFrameEncoded");
var _encoderInitJSDone = Module["_encoderInitJSDone"] = createExportWrapper("encoderInitJSDone");
var _retryRendererWithWasmOpenH264 = Module["_retryRendererWithWasmOpenH264"] = createExportWrapper("retryRendererWithWasmOpenH264");
var _GUVideoExportReportProgress = Module["_GUVideoExportReportProgress"] = createExportWrapper("GUVideoExportReportProgress");
var _videoExportFinishedWithSuccess = Module["_videoExportFinishedWithSuccess"] = createExportWrapper("videoExportFinishedWithSuccess");
var _ffmpegAudioSampleEncoded = Module["_ffmpegAudioSampleEncoded"] = createExportWrapper("ffmpegAudioSampleEncoded");
var _ffEncodeBufferConsumed = Module["_ffEncodeBufferConsumed"] = createExportWrapper("ffEncodeBufferConsumed");
var _resampledAudioCallback = Module["_resampledAudioCallback"] = createExportWrapper("resampledAudioCallback");
var _proxyFrameDecoded = Module["_proxyFrameDecoded"] = createExportWrapper("proxyFrameDecoded");
var _proxyFrameEncoded = Module["_proxyFrameEncoded"] = createExportWrapper("proxyFrameEncoded");
var _proxyGenFinished = Module["_proxyGenFinished"] = createExportWrapper("proxyGenFinished");
var _jsNeedsToPauseProxyGen = Module["_jsNeedsToPauseProxyGen"] = createExportWrapper("jsNeedsToPauseProxyGen");
var _enableHEVCForWebcodecs = Module["_enableHEVCForWebcodecs"] = createExportWrapper("enableHEVCForWebcodecs");
var _jsPassBrowserRecordedStream = Module["_jsPassBrowserRecordedStream"] = createExportWrapper("jsPassBrowserRecordedStream");
var _jsBrowserRecorderStopped = Module["_jsBrowserRecorderStopped"] = createExportWrapper("jsBrowserRecorderStopped");
var _jsPictureLoaded = Module["_jsPictureLoaded"] = createExportWrapper("jsPictureLoaded");
var _getAudioPlaySampleRate = Module["_getAudioPlaySampleRate"] = createExportWrapper("getAudioPlaySampleRate");
var _setAudioPlaySampleRate = Module["_setAudioPlaySampleRate"] = createExportWrapper("setAudioPlaySampleRate");
var _getAudioPlayBuffer = Module["_getAudioPlayBuffer"] = createExportWrapper("getAudioPlayBuffer");
var _getAudioPlayBuffer_safari = Module["_getAudioPlayBuffer_safari"] = createExportWrapper("getAudioPlayBuffer_safari");
var _runTasksOnJSMainThread = Module["_runTasksOnJSMainThread"] = createExportWrapper("runTasksOnJSMainThread");
var _jsFileInputGotData = Module["_jsFileInputGotData"] = createExportWrapper("jsFileInputGotData");
var _jsFileHandlePickerSetFile = Module["_jsFileHandlePickerSetFile"] = createExportWrapper("jsFileHandlePickerSetFile");
var _jsFileHandlePickerDone = Module["_jsFileHandlePickerDone"] = createExportWrapper("jsFileHandlePickerDone");
var _jsWritableFileHandlePickerDone = Module["_jsWritableFileHandlePickerDone"] = createExportWrapper("jsWritableFileHandlePickerDone");
var _jsFileHandleReadDone = Module["_jsFileHandleReadDone"] = createExportWrapper("jsFileHandleReadDone");
var _setPickedFileCount = Module["_setPickedFileCount"] = createExportWrapper("setPickedFileCount");
var _jsFileInputGotItem = Module["_jsFileInputGotItem"] = createExportWrapper("jsFileInputGotItem");
var _getTextToCopy = Module["_getTextToCopy"] = createExportWrapper("getTextToCopy");
var _jsKeyPress = Module["_jsKeyPress"] = createExportWrapper("jsKeyPress");
var _jsKeyDown = Module["_jsKeyDown"] = createExportWrapper("jsKeyDown");
var _jsInput = Module["_jsInput"] = createExportWrapper("jsInput");
var _jsOpenFileNeedsCopy = Module["_jsOpenFileNeedsCopy"] = createExportWrapper("jsOpenFileNeedsCopy");
var _jsReceiveDragAndDropFile = Module["_jsReceiveDragAndDropFile"] = createExportWrapper("jsReceiveDragAndDropFile");
var _getEventLog = Module["_getEventLog"] = createExportWrapper("getEventLog");
var _putrequestprogress = Module["_putrequestprogress"] = createExportWrapper("putrequestprogress");
var ___errno_location = createExportWrapper("__errno_location");
var _fflush = Module["_fflush"] = createExportWrapper("fflush");
var _setThrew = createExportWrapper("setThrew");
var _emscripten_stack_init = function() {
    return (_emscripten_stack_init = Module["asm"]["emscripten_stack_init"]).apply(null, arguments)
};
var _emscripten_stack_set_limits = function() {
    return (_emscripten_stack_set_limits = Module["asm"]["emscripten_stack_set_limits"]).apply(null, arguments)
};
var _emscripten_stack_get_free = function() {
    return (_emscripten_stack_get_free = Module["asm"]["emscripten_stack_get_free"]).apply(null, arguments)
};
var _emscripten_stack_get_base = function() {
    return (_emscripten_stack_get_base = Module["asm"]["emscripten_stack_get_base"]).apply(null, arguments)
};
var _emscripten_stack_get_end = function() {
    return (_emscripten_stack_get_end = Module["asm"]["emscripten_stack_get_end"]).apply(null, arguments)
};
var stackSave = createExportWrapper("stackSave");
var stackRestore = createExportWrapper("stackRestore");
var stackAlloc = createExportWrapper("stackAlloc");
var _emscripten_stack_get_current = function() {
    return (_emscripten_stack_get_current = Module["asm"]["emscripten_stack_get_current"]).apply(null, arguments)
};
var ___cxa_is_pointer_type = createExportWrapper("__cxa_is_pointer_type");
var dynCall_ii = Module["dynCall_ii"] = createExportWrapper("dynCall_ii");
var dynCall_v = Module["dynCall_v"] = createExportWrapper("dynCall_v");
var dynCall_vi = Module["dynCall_vi"] = createExportWrapper("dynCall_vi");
var dynCall_vii = Module["dynCall_vii"] = createExportWrapper("dynCall_vii");
var dynCall_iii = Module["dynCall_iii"] = createExportWrapper("dynCall_iii");
var dynCall_viii = Module["dynCall_viii"] = createExportWrapper("dynCall_viii");
var dynCall_viiiiii = Module["dynCall_viiiiii"] = createExportWrapper("dynCall_viiiiii");
var dynCall_viiiiffii = Module["dynCall_viiiiffii"] = createExportWrapper("dynCall_viiiiffii");
var dynCall_viiiifiii = Module["dynCall_viiiifiii"] = createExportWrapper("dynCall_viiiifiii");
var dynCall_vifff = Module["dynCall_vifff"] = createExportWrapper("dynCall_vifff");
var dynCall_iiiii = Module["dynCall_iiiii"] = createExportWrapper("dynCall_iiiii");
var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = createExportWrapper("dynCall_iiiiiiii");
var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = createExportWrapper("dynCall_iiiiiii");
var dynCall_iiiiii = Module["dynCall_iiiiii"] = createExportWrapper("dynCall_iiiiii");
var dynCall_fi = Module["dynCall_fi"] = createExportWrapper("dynCall_fi");
var dynCall_viff = Module["dynCall_viff"] = createExportWrapper("dynCall_viff");
var dynCall_viiiii = Module["dynCall_viiiii"] = createExportWrapper("dynCall_viiiii");
var dynCall_viiji = Module["dynCall_viiji"] = createExportWrapper("dynCall_viiji");
var dynCall_iiii = Module["dynCall_iiii"] = createExportWrapper("dynCall_iiii");
var dynCall_viif = Module["dynCall_viif"] = createExportWrapper("dynCall_viif");
var dynCall_viiii = Module["dynCall_viiii"] = createExportWrapper("dynCall_viiii");
var dynCall_ji = Module["dynCall_ji"] = createExportWrapper("dynCall_ji");
var dynCall_viiffff = Module["dynCall_viiffff"] = createExportWrapper("dynCall_viiffff");
var dynCall_vijj = Module["dynCall_vijj"] = createExportWrapper("dynCall_vijj");
var dynCall_vif = Module["dynCall_vif"] = createExportWrapper("dynCall_vif");
var dynCall_viiifi = Module["dynCall_viiifi"] = createExportWrapper("dynCall_viiifi");
var dynCall_vijii = Module["dynCall_vijii"] = createExportWrapper("dynCall_vijii");
var dynCall_jij = Module["dynCall_jij"] = createExportWrapper("dynCall_jij");
var dynCall_fii = Module["dynCall_fii"] = createExportWrapper("dynCall_fii");
var dynCall_viifiii = Module["dynCall_viifiii"] = createExportWrapper("dynCall_viifiii");
var dynCall_fiii = Module["dynCall_fiii"] = createExportWrapper("dynCall_fiii");
var dynCall_viffffiii = Module["dynCall_viffffiii"] = createExportWrapper("dynCall_viffffiii");
var dynCall_viffffii = Module["dynCall_viffffii"] = createExportWrapper("dynCall_viffffii");
var dynCall_viiffi = Module["dynCall_viiffi"] = createExportWrapper("dynCall_viiffi");
var dynCall_viifi = Module["dynCall_viifi"] = createExportWrapper("dynCall_viifi");
var dynCall_viiij = Module["dynCall_viiij"] = createExportWrapper("dynCall_viiij");
var dynCall_viij = Module["dynCall_viij"] = createExportWrapper("dynCall_viij");
var dynCall_iij = Module["dynCall_iij"] = createExportWrapper("dynCall_iij");
var dynCall_viji = Module["dynCall_viji"] = createExportWrapper("dynCall_viji");
var dynCall_viffddi = Module["dynCall_viffddi"] = createExportWrapper("dynCall_viffddi");
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = createExportWrapper("dynCall_iiiiiiiii");
var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = createExportWrapper("dynCall_viiiiiiii");
var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = createExportWrapper("dynCall_viiiiiiiii");
var dynCall_jiiii = Module["dynCall_jiiii"] = createExportWrapper("dynCall_jiiii");
var dynCall_jiji = Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");
var dynCall_i = Module["dynCall_i"] = createExportWrapper("dynCall_i");
var dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = createExportWrapper("dynCall_iiiiiiiiii");
var dynCall_vffff = Module["dynCall_vffff"] = createExportWrapper("dynCall_vffff");
var dynCall_vf = Module["dynCall_vf"] = createExportWrapper("dynCall_vf");
var dynCall_vff = Module["dynCall_vff"] = createExportWrapper("dynCall_vff");
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = createExportWrapper("dynCall_viiiiiii");
var dynCall_vfi = Module["dynCall_vfi"] = createExportWrapper("dynCall_vfi");
var dynCall_viffff = Module["dynCall_viffff"] = createExportWrapper("dynCall_viffff");
var dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = createExportWrapper("dynCall_viiiiiiiiii");
var dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] = createExportWrapper("dynCall_viiiiiiiiiii");
var dynCall_iidiiii = Module["dynCall_iidiiii"] = createExportWrapper("dynCall_iidiiii");
var dynCall_viijii = Module["dynCall_viijii"] = createExportWrapper("dynCall_viijii");
var dynCall_iiiiij = Module["dynCall_iiiiij"] = createExportWrapper("dynCall_iiiiij");
var dynCall_iiiiid = Module["dynCall_iiiiid"] = createExportWrapper("dynCall_iiiiid");
var dynCall_iiiiijj = Module["dynCall_iiiiijj"] = createExportWrapper("dynCall_iiiiijj");
var dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = createExportWrapper("dynCall_iiiiiijj");
var _asyncify_start_unwind = createExportWrapper("asyncify_start_unwind");
var _asyncify_stop_unwind = createExportWrapper("asyncify_stop_unwind");
var _asyncify_start_rewind = createExportWrapper("asyncify_start_rewind");
var _asyncify_stop_rewind = createExportWrapper("asyncify_stop_rewind");
var ___start_em_js = Module["___start_em_js"] = 761644;
var ___stop_em_js = Module["___stop_em_js"] = 783309;

function invoke_viiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
        dynCall_viiii(index, a1, a2, a3, a4)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iii(index, a1, a2) {
    var sp = stackSave();
    try {
        return dynCall_iii(index, a1, a2)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
        return dynCall_iiiii(index, a1, a2, a3, a4)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
        return dynCall_iiii(index, a1, a2, a3)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}

function invoke_vi(index, a1) {
    var sp = stackSave();
    try {
        dynCall_vi(index, a1)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0)
    }
}
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
Module["ccall"] = ccall;
Module["cwrap"] = cwrap;
Module["intArrayFromString"] = intArrayFromString;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
Module["allocate"] = allocate;
var missingLibrarySymbols = ["ydayFromDate", "inetPton4", "inetNtop4", "inetPton6", "inetNtop6", "readSockaddr", "writeSockaddr", "getHostByName", "traverseStack", "getCallstack", "emscriptenLog", "convertPCtoSourceLocation", "jstoi_s", "getDynCaller", "asmjsMangle", "HandleAllocator", "getNativeTypeSize", "STACK_SIZE", "STACK_ALIGN", "POINTER_SIZE", "ASSERTIONS", "writeI53ToI64Clamped", "writeI53ToI64Signaling", "writeI53ToU64Clamped", "writeI53ToU64Signaling", "convertU32PairToI53", "uleb128Encode", "generateFuncType", "convertJsFunctionToWasm", "getEmptyTableSlot", "updateTableMap", "getFunctionAddress", "addFunction", "removeFunction", "reallyNegative", "unSign", "strLen", "reSign", "formatString", "intArrayToString", "AsciiToString", "UTF16ToString", "stringToUTF16", "lengthBytesUTF16", "UTF32ToString", "stringToUTF32", "lengthBytesUTF32", "getSocketFromFD", "getSocketAddress", "fillDeviceOrientationEventData", "registerDeviceOrientationEventCallback", "fillDeviceMotionEventData", "registerDeviceMotionEventCallback", "screenOrientation", "fillOrientationChangeEventData", "registerOrientationChangeEventCallback", "hideEverythingExceptGivenElement", "restoreHiddenElements", "softFullscreenResizeWebGLRenderTarget", "registerPointerlockErrorEventCallback", "fillBatteryEventData", "battery", "registerBatteryEventCallback", "jsStackTrace", "stackTrace", "checkWasiClock", "wasiRightsToMuslOFlags", "wasiOFlagsToMuslOFlags", "createDyncallWrapper", "setImmediateWrapped", "clearImmediateWrapped", "polyfillSetImmediate", "getPromise", "makePromise", "idsToPromises", "makePromiseCallback", "_setNetworkCallback", "writeGLArray", "registerWebGlEventCallback", "GLFW_Window", "writeStringToMemory", "writeAsciiToMemory"];
missingLibrarySymbols.forEach(missingLibrarySymbol);
var unexportedSymbols = ["run", "addOnPreRun", "addOnInit", "addOnPreMain", "addOnExit", "addOnPostRun", "FS_createFolder", "FS_createLink", "out", "err", "callMain", "abort", "keepRuntimeAlive", "wasmMemory", "stackAlloc", "stackSave", "stackRestore", "getTempRet0", "setTempRet0", "writeStackCookie", "checkStackCookie", "ptrToString", "zeroMemory", "exitJS", "getHeapMax", "emscripten_realloc_buffer", "ENV", "MONTH_DAYS_REGULAR", "MONTH_DAYS_LEAP", "MONTH_DAYS_REGULAR_CUMULATIVE", "MONTH_DAYS_LEAP_CUMULATIVE", "isLeapYear", "arraySum", "addDays", "ERRNO_CODES", "ERRNO_MESSAGES", "setErrNo", "DNS", "Protocols", "Sockets", "initRandomFill", "randomFill", "timers", "warnOnce", "UNWIND_CACHE", "readEmAsmArgsArray", "readEmAsmArgs", "runEmAsmFunction", "runMainThreadEmAsm", "jstoi_q", "getExecutableName", "listenOnce", "autoResumeAudioContext", "dynCallLegacy", "dynCall", "handleException", "runtimeKeepalivePush", "runtimeKeepalivePop", "callUserCallback", "maybeExit", "safeSetTimeout", "asyncLoad", "alignMemory", "mmapAlloc", "writeI53ToI64", "readI53FromI64", "readI53FromU64", "convertI32PairToI53", "convertI32PairToI53Checked", "getCFunc", "sigToWasmTypes", "freeTableIndexes", "functionsInTableMap", "setValue", "getValue", "PATH", "PATH_FS", "UTF8ArrayToString", "UTF8ToString", "stringToUTF8Array", "stringToUTF8", "lengthBytesUTF8", "stringToAscii", "stringToNewUTF8", "stringToUTF8OnStack", "writeArrayToMemory", "SYSCALLS", "JSEvents", "registerKeyEventCallback", "specialHTMLTargets", "maybeCStringToJsString", "findEventTarget", "findCanvasEventTarget", "getBoundingClientRect", "fillMouseEventData", "registerMouseEventCallback", "registerWheelEventCallback", "registerUiEventCallback", "registerFocusEventCallback", "fillFullscreenChangeEventData", "registerFullscreenChangeEventCallback", "JSEvents_requestFullscreen", "JSEvents_resizeCanvasForFullscreen", "registerRestoreOldStyle", "setLetterbox", "currentFullscreenStrategy", "restoreOldWindowedStyle", "doRequestFullscreen", "fillPointerlockChangeEventData", "registerPointerlockChangeEventCallback", "requestPointerLock", "fillVisibilityChangeEventData", "registerVisibilityChangeEventCallback", "registerTouchEventCallback", "fillGamepadEventData", "registerGamepadEventCallback", "registerBeforeUnloadEventCallback", "setCanvasElementSize", "getCanvasElementSize", "demangle", "demangleAll", "ExitStatus", "getEnvStrings", "doReadv", "doWritev", "dlopenMissingError", "promiseMap", "uncaughtExceptionCount", "exceptionLast", "exceptionCaught", "ExceptionInfo", "Browser", "setMainLoop", "wget", "preloadPlugins", "FS_modeStringToFlags", "FS_getMode", "FS", "MEMFS", "TTY", "PIPEFS", "SOCKFS", "tempFixedLengthArray", "miniTempWebGLFloatBuffers", "miniTempWebGLIntBuffers", "heapObjectForWebGLType", "heapAccessShiftForWebGLHeap", "webgl_enable_WEBGL_multi_draw", "GL", "emscriptenWebGLGet", "computeUnpackAlignedImageSize", "colorChannelsInGlTextureFormat", "emscriptenWebGLGetTexPixelData", "__glGenObject", "emscriptenWebGLGetUniform", "webglGetUniformLocation", "webglPrepareUniformLocationsBeforeFirstUse", "webglGetLeftBracePos", "emscriptenWebGLGetVertexAttrib", "__glGetActiveAttribOrUniform", "emscriptenWebGLGetBufferBinding", "emscriptenWebGLValidateMapBufferTarget", "emscripten_webgl_power_preferences", "AL", "GLUT", "EGL", "GLEW", "IDBStore", "runAndAbortIfError", "Asyncify", "Fibers", "GLFW", "emscriptenWebGLGetIndexed", "webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance", "webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance", "ALLOC_STACK", "allocateUTF8", "allocateUTF8OnStack", "Fetch", "fetchDeleteCachedData", "fetchLoadCachedData", "fetchCacheData", "fetchXHR"];
unexportedSymbols.forEach(unexportedRuntimeSymbol);
var calledRun;
dependenciesFulfilled = function runCaller() {
    if (!calledRun) run();
    if (!calledRun) dependenciesFulfilled = runCaller
};

function callMain() {
    assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
    assert(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
    var entryFunction = _main;
    var argc = 0;
    var argv = 0;
    try {
        var ret = entryFunction(argc, argv);
        exitJS(ret, true);
        return ret
    } catch (e) {
        return handleException(e)
    }
}

function stackCheckInit() {
    _emscripten_stack_init();
    writeStackCookie()
}

function run() {
    if (runDependencies > 0) {
        return
    }
    stackCheckInit();
    preRun();
    if (runDependencies > 0) {
        return
    }

    function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        preMain();
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        if (shouldRunNow) callMain();
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function() {
            setTimeout(function() {
                Module["setStatus"]("")
            }, 1);
            doRun()
        }, 1)
    } else {
        doRun()
    }
    checkStackCookie()
}

function checkUnflushedContent() {
    var oldOut = out;
    var oldErr = err;
    var has = false;
    out = err = x => {
        has = true
    };
    try {
        _fflush(0);
        ["stdout", "stderr"].forEach(function(name) {
            var info = FS.analyzePath("/dev/" + name);
            if (!info) return;
            var stream = info.object;
            var rdev = stream.rdev;
            var tty = TTY.ttys[rdev];
            if (tty && tty.output && tty.output.length) {
                has = true
            }
        })
    } catch (e) {}
    out = oldOut;
    err = oldErr;
    if (has) {
        warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.")
    }
}
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
    }
}
var shouldRunNow = true;
if (Module["noInitialRun"]) shouldRunNow = false;
run();