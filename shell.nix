{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.yarn
  ];  # join lists with ++

  nativeBuildInputs = [
    ~/setup/bash/nix_shortcuts.sh
    ~/setup/bash/node_shortcuts.sh
  ];

  shellHook = ''
    echo-shortcuts ${__curPos.file}
  '';  # join strings with +
}
